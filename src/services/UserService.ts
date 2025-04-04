
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAddress {
  id: string;
  userId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
}

// This is a frontend service mock for user management
// In a real app, these would connect to your backend API
class UserService {
  private users: User[] = [];
  private userAddresses: UserAddress[] = [];
  private currentUser: User | null = null;

  // Create a new user
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      // In a real app, this would be an API call
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.users.push(newUser);
      toast.success("User created successfully!");
      return newUser;
    } catch (error) {
      toast.error("Failed to create user");
      throw error;
    }
  }

  // Get a user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      // In a real app, this would be an API call
      const user = this.users.find(u => u.id === userId) || null;
      if (!user) {
        toast.error("User not found");
      }
      return user;
    } catch (error) {
      toast.error("Failed to fetch user");
      throw error;
    }
  }

  // Update a user
  async updateUser(userId: string, updates: UpdateUserData): Promise<User | null> {
    try {
      // In a real app, this would be an API call
      const index = this.users.findIndex(u => u.id === userId);
      if (index >= 0) {
        this.users[index] = {
          ...this.users[index],
          ...updates,
          updatedAt: new Date()
        };
        toast.success("User updated successfully!");
        return this.users[index];
      }
      
      toast.error("User not found");
      return null;
    } catch (error) {
      toast.error("Failed to update user");
      throw error;
    }
  }

  // Delete a user
  async deleteUser(userId: string): Promise<boolean> {
    try {
      // In a real app, this would be an API call
      const initialLength = this.users.length;
      this.users = this.users.filter(u => u.id !== userId);
      
      if (this.users.length < initialLength) {
        toast.success("User deleted successfully!");
        return true;
      }
      
      toast.error("User not found");
      return false;
    } catch (error) {
      toast.error("Failed to delete user");
      throw error;
    }
  }

  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    try {
      // In a real app, this would be an API call with authentication
      return this.users;
    } catch (error) {
      toast.error("Failed to fetch users");
      throw error;
    }
  }

  // Create a user address
  async createUserAddress(userId: string, address: Omit<UserAddress, 'id' | 'userId'>): Promise<UserAddress> {
    try {
      // In a real app, this would be an API call
      const newAddress: UserAddress = {
        id: `address-${Date.now()}`,
        userId,
        ...address
      };

      this.userAddresses.push(newAddress);
      toast.success("Address added successfully!");
      return newAddress;
    } catch (error) {
      toast.error("Failed to add address");
      throw error;
    }
  }

  // Get addresses for a user
  async getUserAddresses(userId: string): Promise<UserAddress[]> {
    try {
      // In a real app, this would be an API call
      return this.userAddresses.filter(addr => addr.userId === userId);
    } catch (error) {
      toast.error("Failed to fetch addresses");
      throw error;
    }
  }
  
  // Sets a user as logged in (mock)
  setCurrentUser(user: User): void {
    this.currentUser = user;
  }
  
  // Check if a user is logged in (mock)
  getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  // Mock login (in a real app would connect to auth API)
  async login(email: string, password: string): Promise<User | null> {
    try {
      const user = this.users.find(u => u.email === email);
      
      if (user) {
        // In a real app, this would verify the password
        this.currentUser = user;
        toast.success("Logged in successfully!");
        return user;
      }
      
      toast.error("Invalid email or password");
      return null;
    } catch (error) {
      toast.error("Login failed");
      throw error;
    }
  }
  
  // Mock logout
  async logout(): Promise<boolean> {
    try {
      this.currentUser = null;
      toast.success("Logged out successfully!");
      return true;
    } catch (error) {
      toast.error("Logout failed");
      throw error;
    }
  }
}

export const userService = new UserService();
