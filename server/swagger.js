import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Cấu hình cơ bản cho Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Hệ thống quản lý cửa hàng bán đồ ăn API',
    version: '2.0.0',
    description: 'API documentation cho hệ thống quản lý cửa hàng bán đồ ăn hiện đại',
    contact: {
      name: 'Lamvanna',
      email: 'lamna01633661157@gmail.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    },
    {
      url: 'https://your-production-domain.com',
      description: 'Production server'
    }
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'API xác thực người dùng'
    },
    {
      name: 'Products',
      description: 'API quản lý sản phẩm'
    },
    {
      name: 'Orders',
      description: 'API quản lý đơn hàng'
    },
    {
      name: 'Users',
      description: 'API quản lý người dùng'
    },
    {
      name: 'Reviews',
      description: 'API quản lý đánh giá'
    },
    {
      name: 'Banners',
      description: 'API quản lý banner'
    },
    {
      name: 'Statistics',
      description: 'API thống kê'
    },
    {
      name: 'Upload',
      description: 'API upload file'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      sessionAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'connect.sid'
      }
    },
    schemas: {
      User: {
        type: 'object',
        required: ['email', 'fullName', 'role'],
        properties: {
          _id: {
            type: 'string',
            description: 'User ID'
          },
          username: {
            type: 'string',
            description: 'Username (auto-generated from email)'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email'
          },
          fullName: {
            type: 'string',
            description: 'Full name of the user'
          },
          phone: {
            type: 'string',
            description: 'Phone number (optional)'
          },
          address: {
            type: 'string',
            description: 'Address (optional)'
          },
          role: {
            type: 'string',
            enum: ['user', 'staff', 'admin'],
            description: 'User role'
          },
          isActive: {
            type: 'boolean',
            description: 'Account status'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp'
          }
        }
      },
      Product: {
        type: 'object',
        required: ['name', 'price', 'category'],
        properties: {
          _id: {
            type: 'string',
            description: 'Product ID'
          },
          name: {
            type: 'string',
            description: 'Product name'
          },
          description: {
            type: 'string',
            description: 'Product description'
          },
          price: {
            type: 'number',
            minimum: 0,
            description: 'Product price'
          },
          category: {
            type: 'string',
            description: 'Product category'
          },
          image: {
            type: 'string',
            description: 'Product image URL'
          },
          available: {
            type: 'boolean',
            default: true,
            description: 'Product availability'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp'
          }
        }
      },
      Order: {
        type: 'object',
        required: ['items', 'total'],
        properties: {
          _id: {
            type: 'string',
            description: 'Order ID'
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: {
                  type: 'string',
                  description: 'Product ID'
                },
                quantity: {
                  type: 'integer',
                  minimum: 1,
                  description: 'Quantity'
                },
                price: {
                  type: 'number',
                  minimum: 0,
                  description: 'Price at time of order'
                }
              }
            }
          },
          total: {
            type: 'number',
            minimum: 0,
            description: 'Total order amount'
          },
          status: {
            type: 'string',
            enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
            default: 'pending',
            description: 'Order status'
          },
          customerInfo: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Customer name'
              },
              phone: {
                type: 'string',
                description: 'Customer phone'
              },
              address: {
                type: 'string',
                description: 'Delivery address'
              }
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Error message'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Error timestamp'
          }
        }
      }
    }
  }
};

// Cấu hình options cho swagger-jsdoc
const options = {
  definition: swaggerDefinition,
  apis: [
    './server/routes.js',
    './server/routes/*.js', // Nếu bạn có nhiều file routes
    './server/controllers/*.js' // Nếu bạn có controllers riêng
  ]
};

// Tạo swagger specification
const swaggerSpec = swaggerJSDoc(options);

// Cấu hình Swagger UI
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true
  }
};

export { swaggerSpec, swaggerUi, swaggerUiOptions };
