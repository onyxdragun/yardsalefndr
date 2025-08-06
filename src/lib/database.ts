// Database service using connection pool
import { getConnection, query, transaction } from './db-pool';
import type { Connection } from './db-pool';
import { GarageSale, User, Category, SearchFilters, SearchResult } from '@/types/database';

// Database utility functions
export class DatabaseService {
  
  // Test database connection
  static async testConnection(): Promise<boolean> {
    try {
      const connection = await getConnection();
      await connection.ping();
      connection.release();
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  // User operations
  static async createUser(userData: any): Promise<User> {
    const userId = await transaction(async (connection: Connection) => {
      const result = await connection.execute(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, preferred_location, preferred_radius_km, subscription_tier, monthly_sales_limit)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userData.email, userData.passwordHash, userData.firstName, userData.lastName, 
         userData.phone, userData.preferredLocation, userData.preferredRadiusKm || 25,
         userData.subscriptionTier || 'registered', userData.monthlySalesLimit || 5]
      );
      return result.insertId;
    });

    // Get the created user (without password hash)
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('Failed to create user');
    }
    return user;
  }

  static async getUserById(id: number): Promise<User | null> {
    const rows = await query<any[]>(
      'SELECT id, email, first_name, last_name, phone, preferred_location, preferred_radius_km, email_verified, is_active, email_notifications, push_notifications, profile_image_url, subscription_tier, subscription_expires_at, monthly_sales_limit, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? this.mapRowToUser(rows[0]) : null;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const rows = await query<any[]>(
      'SELECT id, email, first_name, last_name, phone, preferred_location, preferred_radius_km, email_verified, is_active, email_notifications, push_notifications, profile_image_url, subscription_tier, subscription_expires_at, monthly_sales_limit, created_at, updated_at FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? this.mapRowToUser(rows[0]) : null;
  }

  static async getUserByEmailWithPassword(email: string): Promise<(User & { passwordHash: string }) | null> {
    const rows = await query<any[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) return null;
    
    const user = this.mapRowToUser(rows[0]);
    return {
      ...user,
      passwordHash: rows[0].password_hash
    };
  }

  // Garage Sale operations
  static async createGarageSale(saleData: any): Promise<GarageSale> {
    const saleId = await transaction(async (connection: Connection) => {
      const result = await connection.execute(
        `INSERT INTO garage_sales (
          user_id, title, description, address, city, province, postal_code, 
          phone, contact_email, start_date, end_date, start_time, end_time, status, 
          latitude, longitude, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          saleData.userId, saleData.title, saleData.description, saleData.address,
          saleData.city, saleData.province, saleData.postalCode, saleData.phone,
          saleData.contactEmail, saleData.startDate, saleData.endDate, saleData.startTime, saleData.endTime,
          saleData.status || 'active', saleData.latitude, saleData.longitude
        ]
      );
      return result.insertId;
    });

    // Get the created garage sale
    const sale = await this.getGarageSaleById(saleId);
    if (!sale) {
      throw new Error('Failed to create garage sale');
    }
    return sale;
  }

  static async getGarageSaleById(id: number): Promise<GarageSale | null> {
    const rows = await query<any>(
      `SELECT gs.*, u.first_name, u.last_name, u.email, u.phone as user_phone,
       GROUP_CONCAT(DISTINCT c.name) as category_names,
       GROUP_CONCAT(DISTINCT c.slug) as category_slugs
       FROM garage_sales gs
       LEFT JOIN users u ON gs.user_id = u.id
       LEFT JOIN garage_sale_categories gsc ON gs.id = gsc.garage_sale_id
       LEFT JOIN categories c ON gsc.category_id = c.id
       WHERE gs.id = ?
       GROUP BY gs.id`,
      [id]
    );
    return rows.length > 0 ? this.mapRowToGarageSale(rows[0]) : null;
  }

  static async getUserGarageSales(userId: number): Promise<GarageSale[]> {
    const sql = `
      SELECT gs.*, u.first_name, u.last_name, u.email, u.phone as user_phone,
      GROUP_CONCAT(DISTINCT c.name) as category_names,
      GROUP_CONCAT(DISTINCT c.slug) as category_slugs
      FROM garage_sales gs
      LEFT JOIN users u ON gs.user_id = u.id
      LEFT JOIN garage_sale_categories gsc ON gs.id = gsc.garage_sale_id
      LEFT JOIN categories c ON gsc.category_id = c.id
      WHERE gs.user_id = ?
      GROUP BY gs.id
      ORDER BY gs.created_at DESC
    `;

    const rows = await query<any[]>(sql, [userId]);
    return rows.map(row => this.mapRowToGarageSale(row));
  }

  static async getGarageSales(filters: SearchFilters = {}, userLocation?: { latitude: number; longitude: number }): Promise<GarageSale[]> {
    // Get active categories for mapping (currently unused but available for future use)
    const categoryRows = await query<any[]>(
      'SELECT * FROM categories WHERE status = "active"'
    );
    // const categories = categoryRows.map(row => this.mapRowToCategory(row));

    // Build WHERE clause based on filters - only show active sales that haven't expired
    let whereClause = 'WHERE gs.status IN ("active", "completed") AND gs.end_date >= CURDATE()';
    const params: any[] = [];

    if (filters.location) {
      whereClause += ' AND (gs.city LIKE ? OR gs.address LIKE ?)';
      params.push(`%${filters.location}%`, `%${filters.location}%`);
    }

    if (filters.startDate) {
      whereClause += ' AND gs.start_date >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      whereClause += ' AND gs.end_date <= ?';
      params.push(filters.endDate);
    }

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      const categoryPlaceholders = filters.categoryIds.map(() => '?').join(',');
      whereClause += ` AND EXISTS (
        SELECT 1 FROM garage_sale_categories gsc 
        WHERE gsc.garage_sale_id = gs.id AND gsc.category_id IN (${categoryPlaceholders})
      )`;
      params.push(...filters.categoryIds);
    }

    // Build radius filter if provided
    if (filters.radiusKm && userLocation) {
      whereClause += ` AND gs.latitude IS NOT NULL AND gs.longitude IS NOT NULL 
        AND (
          6371 * acos(
            cos(radians(?)) * cos(radians(gs.latitude)) * 
            cos(radians(gs.longitude) - radians(?)) + 
            sin(radians(?)) * sin(radians(gs.latitude))
          )
        ) <= ?`;
      params.push(userLocation.latitude, userLocation.longitude, userLocation.latitude, filters.radiusKm);
    } else if (filters.radiusKm) {
      whereClause += ` AND gs.latitude IS NOT NULL AND gs.longitude IS NOT NULL`;
    }

    const sql = `
      SELECT gs.*, u.first_name, u.last_name, u.email, u.phone as user_phone,
      GROUP_CONCAT(DISTINCT c.name) as category_names,
      GROUP_CONCAT(DISTINCT c.slug) as category_slugs
      FROM garage_sales gs
      LEFT JOIN users u ON gs.user_id = u.id
      LEFT JOIN garage_sale_categories gsc ON gs.id = gsc.garage_sale_id
      LEFT JOIN categories c ON gsc.category_id = c.id
      ${whereClause}
      GROUP BY gs.id
      ORDER BY gs.start_date ASC, gs.start_time ASC
    `;

    const rows = await query<any[]>(sql, params);
    return rows.map(row => this.mapRowToGarageSale(row));
  }

  static async searchGarageSales(
    searchQuery: string,
    filters: SearchFilters = {},
    limit: number = 20,
    offset: number = 0,
    userLocation?: { latitude: number; longitude: number }
  ): Promise<SearchResult> {
    // Build search conditions - only show active sales that haven't expired
    let whereClause = 'WHERE gs.status IN ("active", "completed") AND gs.end_date >= CURDATE()';
    const params: any[] = [];

    if (searchQuery) {
      whereClause += ' AND (gs.title LIKE ? OR gs.description LIKE ? OR gs.address LIKE ? OR gs.city LIKE ?)';
      const searchTerm = `%${searchQuery}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Add other filters similar to getGarageSales method
    if (filters.location) {
      whereClause += ' AND (gs.city LIKE ? OR gs.address LIKE ?)';
      params.push(`%${filters.location}%`, `%${filters.location}%`);
    }

    if (filters.startDate) {
      whereClause += ' AND gs.start_date >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      whereClause += ' AND gs.end_date <= ?';
      params.push(filters.endDate);
    }

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      const categoryPlaceholders = filters.categoryIds.map(() => '?').join(',');
      whereClause += ` AND EXISTS (
        SELECT 1 FROM garage_sale_categories gsc 
        WHERE gsc.garage_sale_id = gs.id AND gsc.category_id IN (${categoryPlaceholders})
      )`;
      params.push(...filters.categoryIds);
    }

    // Build radius filter if provided
    if (filters.radiusKm && userLocation) {
      whereClause += ` AND gs.latitude IS NOT NULL AND gs.longitude IS NOT NULL 
        AND (
          6371 * acos(
            cos(radians(?)) * cos(radians(gs.latitude)) * 
            cos(radians(gs.longitude) - radians(?)) + 
            sin(radians(?)) * sin(radians(gs.latitude))
          )
        ) <= ?`;
      params.push(userLocation.latitude, userLocation.longitude, userLocation.latitude, filters.radiusKm);
    } else if (filters.radiusKm) {
      whereClause += ` AND gs.latitude IS NOT NULL AND gs.longitude IS NOT NULL`;
    }

    // Get total count
    const countSql = `SELECT COUNT(DISTINCT gs.id) as total FROM garage_sales gs ${whereClause}`;
    const countRows = await query<any[]>(countSql, params);
    const total = Number(countRows[0]?.total || 0);

    // Get results with pagination
    const sql = `
      SELECT gs.*, u.first_name, u.last_name, u.email, u.phone as user_phone,
      GROUP_CONCAT(DISTINCT c.name) as category_names,
      GROUP_CONCAT(DISTINCT c.slug) as category_slugs
      FROM garage_sales gs
      LEFT JOIN users u ON gs.user_id = u.id
      LEFT JOIN garage_sale_categories gsc ON gs.id = gsc.garage_sale_id
      LEFT JOIN categories c ON gsc.category_id = c.id
      ${whereClause}
      GROUP BY gs.id
      ORDER BY gs.start_date ASC, gs.start_time ASC
      LIMIT ? OFFSET ?
    `;

    const rows = await query<any[]>(sql, [...params, limit, offset]);
    const sales = rows.map(row => this.mapRowToGarageSale(row));

    return {
      garageSales: sales,
      totalCount: total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
      hasMore: offset + limit < total
    };
  }

  static async getCategories(): Promise<Category[]> {
    const rows = await query<any[]>(
      'SELECT * FROM categories WHERE status = "active" ORDER BY sort_order, name'
    );
    return rows.map(row => this.mapRowToCategory(row));
  }

  static async addCategoriesToGarageSale(garageSaleId: number, categoryIds: string[]): Promise<void> {
    await transaction(async (connection: Connection) => {
      for (const categoryId of categoryIds) {
        // First, get the category ID by slug/id
        const categoryResult = await connection.execute(
          'SELECT id FROM categories WHERE slug = ?',
          [categoryId]
        );
        
        if (categoryResult.length > 0) {
          const dbCategoryId = categoryResult[0].id;
          
          // Insert the association
          await connection.execute(
            'INSERT IGNORE INTO garage_sale_categories (garage_sale_id, category_id) VALUES (?, ?)',
            [garageSaleId, dbCategoryId]
          );
        }
      }
    });
  }

  static async updateGarageSaleCategories(garageSaleId: number, categoryIds: string[]): Promise<void> {
    await transaction(async (connection: Connection) => {
      // First, remove all existing categories for this garage sale
      await connection.execute(
        'DELETE FROM garage_sale_categories WHERE garage_sale_id = ?',
        [garageSaleId]
      );
      
      // Then add the new categories
      for (const categoryId of categoryIds) {
        // Get the category ID by slug
        const categoryResult = await connection.execute(
          'SELECT id FROM categories WHERE slug = ?',
          [categoryId]
        );
        
        if (categoryResult.length > 0) {
          const dbCategoryId = categoryResult[0].id;
          
          // Insert the association
          await connection.execute(
            'INSERT INTO garage_sale_categories (garage_sale_id, category_id) VALUES (?, ?)',
            [garageSaleId, dbCategoryId]
          );
        }
      }
    });
  }

  static async updateGarageSale(id: number, saleData: any): Promise<GarageSale> {
    await transaction(async (connection: Connection) => {
      await connection.execute(
        `UPDATE garage_sales SET 
          title = ?, description = ?, address = ?, city = ?, province = ?, postal_code = ?, 
          phone = ?, start_date = ?, end_date = ?, start_time = ?, end_time = ?, 
          latitude = ?, longitude = ?, contact_phone = ?, contact_email = ?, 
          is_multi_family = ?, cash_only = ?, early_birds_welcome = ?, 
          updated_at = NOW()
         WHERE id = ?`,
        [
          saleData.title, saleData.description, saleData.address, saleData.city, 
          saleData.province, saleData.postalCode, saleData.phone, saleData.startDate, 
          saleData.endDate, saleData.startTime, saleData.endTime, saleData.latitude, 
          saleData.longitude, saleData.contactPhone, saleData.contactEmail,
          saleData.isMultiFamily || false, saleData.cashOnly || false, 
          saleData.earlyBirdsWelcome !== false, id
        ]
      );
    });

    // Get the updated garage sale
    const sale = await this.getGarageSaleById(id);
    if (!sale) {
      throw new Error('Failed to update garage sale');
    }
    return sale;
  }

  static async deleteGarageSale(id: number): Promise<void> {
    await transaction(async (connection: Connection) => {
      // First delete related records
      await connection.execute(
        'DELETE FROM garage_sale_categories WHERE garage_sale_id = ?',
        [id]
      );
      
      // Then delete the garage sale itself
      await connection.execute(
        'DELETE FROM garage_sales WHERE id = ?',
        [id]
      );
    });
  }

  static async incrementViewCount(garageSaleId: number): Promise<void> {
    await query(
      'UPDATE garage_sales SET views_count = views_count + 1 WHERE id = ?',
      [garageSaleId]
    );
  }

  // Subscription and usage management
  static async updateUserSubscriptionTier(userId: number, tier: string): Promise<void> {
    await query(
      'UPDATE users SET subscription_tier = ?, updated_at = NOW() WHERE id = ?',
      [tier, userId]
    );
  }

  static async getUserUsage(userId: number, monthYear: string): Promise<{ salesPosted: number }> {
    const rows = await query<any[]>(
      'SELECT sales_posted FROM user_usage WHERE user_id = ? AND month_year = ?',
      [userId, monthYear]
    );
    
    return {
      salesPosted: rows.length > 0 ? rows[0].sales_posted : 0
    };
  }

  static async incrementUserSalesCount(userId: number): Promise<void> {
    const monthYear = new Date().toISOString().slice(0, 7); // '2025-07'
    
    await query(
      `INSERT INTO user_usage (user_id, month_year, sales_posted) 
       VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE 
       sales_posted = sales_posted + 1,
       updated_at = NOW()`,
      [userId, monthYear]
    );
  }

  static async checkUserSalesLimit(userId: number): Promise<{ canPost: boolean; currentCount: number; limit: number }> {
    const monthYear = new Date().toISOString().slice(0, 7);
    
    // Get user's subscription tier and limits
    const userRows = await query<any[]>(
      'SELECT subscription_tier, monthly_sales_limit FROM users WHERE id = ?',
      [userId]
    );
    
    if (userRows.length === 0) {
      throw new Error('User not found');
    }
    
    const { subscription_tier, monthly_sales_limit } = userRows[0];
    
    // Get current usage
    const usage = await this.getUserUsage(userId, monthYear);
    
    // Define tier limits
    const tierLimits: Record<string, number> = {
      registered: 2,
      premium: 10,
      business: 999
    };
    
    const limit = monthly_sales_limit || tierLimits[subscription_tier] || 2;
    const canPost = usage.salesPosted < limit;
    
    return {
      canPost,
      currentCount: usage.salesPosted,
      limit
    };
  }

  // Favorites management
  static async getFavoriteIds(userId: number): Promise<number[]> {
    const rows = await query<any[]>(
      'SELECT garage_sale_id FROM user_favorites WHERE user_id = ?',
      [userId]
    );
    return rows.map(row => row.garage_sale_id);
  }

  static async addToFavorites(userId: number, garageSaleId: number): Promise<void> {
    await query(
      'INSERT IGNORE INTO user_favorites (user_id, garage_sale_id) VALUES (?, ?)',
      [userId, garageSaleId]
    );
  }

  static async removeFromFavorites(userId: number, garageSaleId: number): Promise<void> {
    await query(
      'DELETE FROM user_favorites WHERE user_id = ? AND garage_sale_id = ?',
      [userId, garageSaleId]
    );
  }

  static async getUserFavorites(userId: number): Promise<GarageSale[]> {
    const sql = `
      SELECT gs.*, u.first_name, u.last_name, u.email, u.phone as user_phone,
      GROUP_CONCAT(DISTINCT c.name) as category_names,
      GROUP_CONCAT(DISTINCT c.slug) as category_slugs
      FROM garage_sales gs
      INNER JOIN user_favorites uf ON gs.id = uf.garage_sale_id
      LEFT JOIN users u ON gs.user_id = u.id
      LEFT JOIN garage_sale_categories gsc ON gs.id = gsc.garage_sale_id
      LEFT JOIN categories c ON gsc.category_id = c.id
      WHERE uf.user_id = ? AND gs.status IN ('active', 'completed') AND gs.end_date >= CURDATE()
      GROUP BY gs.id
      ORDER BY uf.created_at DESC
    `;

    const rows = await query<any[]>(sql, [userId]);
    return rows.map(row => this.mapRowToGarageSale(row));
  }

  private static mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isActive: row.is_active,
      emailVerified: row.email_verified,
      profileImageUrl: row.profile_image_url,
      preferredLocation: row.preferred_location,
      preferredRadiusKm: row.preferred_radius_km || 25,
      emailNotifications: row.email_notifications,
      pushNotifications: row.push_notifications,
      subscriptionTier: row.subscription_tier || 'anonymous',
      subscriptionExpiresAt: row.subscription_expires_at,
      monthlySalesLimit: row.monthly_sales_limit || 1
    };
  }

  private static mapRowToCategory(row: any): Category {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      icon: row.icon,
      color: row.color,
      isActive: row.status === 'active',
      sortOrder: row.sort_order
    };
  }

  private static mapRowToGarageSale(row: any): GarageSale {
    const garageSale: GarageSale = {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      address: row.address,
      city: row.city,
      province: row.province,
      postalCode: row.postal_code,
      contactPhone: row.contact_phone || row.phone,
      contactEmail: row.contact_email,
      contactMethod: row.contact_method || 'phone',
      startDate: row.start_date,
      endDate: row.end_date,
      startTime: row.start_time,
      endTime: row.end_time,
      // Dynamically set status based on dates
      status: (() => {
        const today = new Date();
        const start = row.start_date ? new Date(row.start_date) : null;
        const end = row.end_date ? new Date(row.end_date) : null;
        if (start && today < start) return 'scheduled';
        if (end && today > end) return 'completed';
        if (start && end && today >= start && today <= end) return 'active';
        return row.status || 'active';
      })(),
      latitude: row.latitude,
      longitude: row.longitude,
      isMultiFamily: Boolean(row.is_multi_family),
      cashOnly: Boolean(row.cash_only),
      earlyBirdsWelcome: Boolean(row.early_birds_welcome),
      viewsCount: row.views_count || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    // Add user information if available from JOIN
    if (row.first_name || row.last_name || row.email) {
      garageSale.user = {
        id: row.user_id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        phone: row.user_phone,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        emailVerified: false,
        preferredRadiusKm: 25,
        emailNotifications: true,
        pushNotifications: false,
        subscriptionTier: 'registered',
        monthlySalesLimit: 5
      } as User;
    }

    // Add categories if available
    if (row.category_names && row.category_slugs) {
      garageSale.categories = row.category_names.split(',').map((name: string, index: number) => ({
        id: 0, // We don't have category ID in this query
        name: name.trim(),
        slug: row.category_slugs.split(',')[index]?.trim(),
        isActive: true,
        sortOrder: 0
      })).filter((cat: any) => cat.name && cat.slug);
    }

    return garageSale;
  }
}
