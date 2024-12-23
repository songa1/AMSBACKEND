export const authDocs = {
  // Existing endpoints...

  '/api/auth/change-password': {
    post: {
      summary: 'Change the user password',
      tags: ['Auth'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                userId: {
                  type: 'string',
                  example: 'user-id',
                },
                pastPassword: {
                  type: 'string',
                  example: 'oldpassword123',
                },
                password: {
                  type: 'string',
                  example: 'newpassword123',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password changed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Password change is successful',
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Invalid password or user not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Enter correct password, or use forgot password!',
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Server error',
        },
      },
    },
  },
  '/api/auth/logout': {
    post: {
      summary: 'Logout a user',
      tags: ['Auth'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                userId: {
                  type: 'string',
                  example: 'user-id',
                },
                token: {
                  type: 'string',
                  example: 'user-token',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Logout successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Logout successful',
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Invalid user or token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'User do not exist!',
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Server error',
        },
      },
    },
  },
  '/api/auth/request-link': {
    post: {
      summary: 'Request a password reset link',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  example: 'user@example.com',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Password reset link sent successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Link sent successfully, check your email!',
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'User is not found!',
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Server error',
        },
      },
    },
  },
  '/api/auth/reset-password': {
    post: {
      summary: 'Reset user password',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: 'reset-token',
                },
                newPassword: {
                  type: 'string',
                  example: 'newpassword123',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Password reset successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Your password has been changed successfully!',
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'User not found',
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Server error',
        },
      },
    },
  },
  '/api/auth/login': {
    post: {
      summary: 'Log in a user',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  example: 'user@example.com',
                },
                password: {
                  type: 'string',
                  example: 'userpassword123',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Login successful',
                  },
                  token: {
                    type: 'string',
                    example: 'jwt-token',
                  },
                  user: {
                    type: 'object',
                    example: {
                      id: 'user-id',
                      email: 'user@example.com',
                      firstName: 'John',
                      lastName: 'Doe',
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Invalid credentials',
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Server error',
        },
      },
    },
  },
};
