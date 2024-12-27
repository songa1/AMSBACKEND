export const userDocs = {
  // Existing endpoints...

  '/api/users': {
    post: {
      summary: 'Create a new user',
      tags: ['Admin'],
      security: [
        {
          bearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    firstName: { type: 'string', example: 'Raissa' },
                    middleName: { type: 'string', example: '' },
                    lastName: { type: 'string', example: 'UWINGABIRE' },
                    email: { type: 'string', example: 'raissacarry59@gmail.com' },
                    residentCountryId: { type: 'string', example: 'RW' },
                    residentDistrictId: { type: 'string', example: 'East-1' },
                    residentSectorId: { type: 'string', example: 'East-1-9' },
                    phoneNumber: { type: 'string', example: '+250787828963' },
                    whatsappNumber: { type: 'string', example: '+25078782763' },
                    genderName: { type: 'string', example: 'Female' },
                    nearestLandmark: { type: 'string', example: 'City Hall' },
                    cohortId: { type: 'integer', example: 1 },
                    trackId: { type: 'string', example: 'pm' },
                    role: { type: 'string', example: '11' },
                    profileImageId: { type: 'string', example: 'default' },
                    bio: { type: 'string', example: 'A passionate software developer.' },
                    positionInFounded: { type: 'string', example: 'Founder' },
                    positionInEmployed: { type: 'string', example: 'Software Engineer' },
                    state: { type: 'string', example: 'BGL' },
                    password: { type: 'string', example: 'securePassword' },
                    facebook: { type: 'string', example: 'https://facebook.com/john.smith' },
                    instagram: { type: 'string', example: 'https://instagram.com/john.smith' },
                    linkedin: { type: 'string', example: 'https://linkedin.com/in/johnsmith' },
                    twitter: { type: 'string', example: 'https://twitter.com/johnsmith' },
                  },
                },
                organizationFounded: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 14 },
                    stateId: { type: 'string', example: 'BGL' },
                    socials: { type: 'string', example: 'https://twitter.com/organization' },
                    name: { type: 'string', example: 'Tech Pioneers' },
                    workingSectorId: { type: 'string', example: 'communication' },
                    countryId: { type: 'string', example: 'RW' },
                    districtId: { type: 'string', example: 'Bugesera' },
                    sectorId: { type: 'string', example: 'East-1-9' },
                    website: { type: 'string', example: 'https://techpioneers.com' },
                  },
                },
                organizationEmployed: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 16 },
                    stateId: { type: 'string', example: 'BGL' },
                    socials: { type: 'string', example: 'https://facebook.com/employer' },
                    name: { type: 'string', example: 'Innovative Solutions Inc.' },
                    workingSectorId: { type: 'string', example: 'communication' },
                    countryId: { type: 'string', example: 'RW' },
                    districtId: { type: 'string', example: 'Bugesera' },
                    sectorId: { type: 'string', example: 'East-1-9' },
                    website: { type: 'string', example: 'https://innovativesolutions.com' },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'User created successfully' },
                  user: {
                    type: 'object',
                    example: {
                      id: 'user-id',
                      firstName: 'Raissa',
                      lastName: 'UWINGABIRE',
                      email: 'raissacarry59@gmail.com',
                    },
                  },
                },
              },
            },
          },
        },
        409: {
          description: 'Conflict - user already exists',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'User with this email already exists' },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Internal Server Error' },
                },
              },
            },
          },
        },
      },
    },
  },
  // Existing endpoints...

  '/api/users/all': {
    get: {
      summary: 'Get all users',
      tags: ['User'],
      responses: {
        200: {
          description: 'List of all users',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'List of all users' },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'user-id' },
                        firstName: { type: 'string', example: 'Raissa' },
                        lastName: { type: 'string', example: 'UWINGABIRE' },
                        email: { type: 'string', example: 'raissacarry59@gmail.com' },
                        organizationEmployed: { type: 'object', example: null },
                        organizationFounded: { type: 'object', example: null },
                        gender: { type: 'string', example: 'Female' },
                        cohort: { type: 'object', example: null },
                        role: { type: 'object', example: null },
                      },
                    },
                  },
                  count: { type: 'integer', example: 5 },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Internal Server Error' },
                },
              },
            },
          },
        },
      },
    },
    // Existing POST endpoint for creating a user...
  },

  '/api/users/{id}': {
    get: {
      summary: 'Get user by ID',
      tags: ['User'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'The ID of the user to retrieve',
          schema: { type: 'string', example: 'user-id' },
        },
      ],
      responses: {
        200: {
          description: 'User retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'user-id' },
                  firstName: { type: 'string', example: 'Raissa' },
                  lastName: { type: 'string', example: 'UWINGABIRE' },
                  email: { type: 'string', example: 'raissacarry59@gmail.com' },
                  organizationEmployed: { type: 'object', example: null },
                  organizationFounded: { type: 'object', example: null },
                  gender: { type: 'string', example: 'Female' },
                  cohort: { type: 'object', example: null },
                  role: { type: 'object', example: null },
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
                  error: { type: 'string', example: 'User not found' },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Internal Server Error' },
                },
              },
            },
          },
        },
      },
    },
  },
  // Existing endpoints...

  '/api/users/bulk': {
    post: {
      summary: 'Create multiple users in bulk',
      tags: ['Admin'],
      security: [
        {
          bearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                users: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      firstName: { type: 'string', example: 'Raissa' },
                      middleName: { type: 'string', example: '' },
                      lastName: { type: 'string', example: 'UWINGABIRE' },
                      email: { type: 'string', example: 'raissacarry59@gmail.com' },
                      residentCountryId: { type: 'string', example: 'RW' },
                      residentDistrictId: { type: 'string', example: 'East-1' },
                      residentSectorId: { type: 'string', example: 'East-1-9' },
                      phoneNumber: { type: 'string', example: '+250787828963' },
                      whatsappNumber: { type: 'string', example: '+25078782763' },
                      genderName: { type: 'string', example: 'Female' },
                      nearestLandmark: { type: 'string', example: 'City Hall' },
                      cohortId: { type: 'integer', example: 1 },
                      trackId: { type: 'string', example: 'pm' },
                      bio: { type: 'string', example: 'A passionate software developer.' },
                      positionInFounded: { type: 'string', example: 'Founder' },
                      positionInEmployed: { type: 'string', example: 'Software Engineer' },
                      state: { type: 'string', example: 'BGL' },
                      password: { type: 'string', example: 'securePassword' },
                      facebook: { type: 'string', example: 'https://facebook.com/john.smith' },
                      instagram: { type: 'string', example: 'https://instagram.com/john.smith' },
                      linkedin: { type: 'string', example: 'https://linkedin.com/in/johnsmith' },
                      twitter: { type: 'string', example: 'https://twitter.com/johnsmith' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Users created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Users created successfully' },
                  users: {
                    type: 'array',
                    items: {
                      type: 'object',
                      example: {
                        id: 'user-id',
                        firstName: 'Raissa',
                        lastName: 'UWINGABIRE',
                        email: 'raissacarry59@gmail.com',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad Request - some users already exist',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'User with email raissacarry59@gmail.com already exists' },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Internal Server Error' },
                },
              },
            },
          },
        },
      },
    },
  },
  // Existing endpoints...

  '/api/users/update/{userId}': {
    put: {
      summary: 'Update user details',
      tags: ['User'],
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          description: 'The ID of the user to update',
          schema: {
            type: 'string',
            example: 'user-id',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    firstName: { type: 'string', example: 'Raissa' },
                    middleName: { type: 'string', example: '' },
                    lastName: { type: 'string', example: 'UWINGABIRE' },
                    email: { type: 'string', example: 'raissacarry59@gmail.com' },
                    residentCountryId: { type: 'string', example: 'RW' },
                    residentDistrictId: { type: 'string', example: 'East-1' },
                    residentSectorId: { type: 'string', example: 'East-1-9' },
                    phoneNumber: { type: 'string', example: '+250787828963' },
                    whatsappNumber: { type: 'string', example: '+25078782763' },
                    genderName: { type: 'string', example: 'Female' },
                    nearestLandmark: { type: 'string', example: 'City Hall' },
                    cohortId: { type: 'integer', example: 1 },
                    trackId: { type: 'string', example: 'pm' },
                    bio: { type: 'string', example: 'A passionate software developer.' },
                    positionInFounded: { type: 'string', example: 'Founder' },
                    positionInEmployed: { type: 'string', example: 'Software Engineer' },
                    state: { type: 'string', example: 'BGL' },
                    password: { type: 'string', example: 'securePassword' },
                    facebook: { type: 'string', example: 'https://facebook.com/john.smith' },
                    instagram: { type: 'string', example: 'https://instagram.com/john.smith' },
                    linkedin: { type: 'string', example: 'https://linkedin.com/in/johnsmith' },
                    twitter: { type: 'string', example: 'https://twitter.com/johnsmith' },
                  },
                },
                organizationFounded: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: 'org-id' },
                    name: { type: 'string', example: 'TechCorp' },
                    website: { type: 'string', example: 'https://techcorp.com' },
                    // Other organization details...
                  },
                },
                organizationEmployed: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: 'org-id' },
                    name: { type: 'string', example: 'SoftwareInc' },
                    website: { type: 'string', example: 'https://softwareinc.com' },
                    // Other organization details...
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'User updated successfully' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'user-id' },
                      firstName: { type: 'string', example: 'Raissa' },
                      lastName: { type: 'string', example: 'UWINGABIRE' },
                      email: { type: 'string', example: 'raissacarry59@gmail.com' },
                      // Other user properties...
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad Request - Invalid input data',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Invalid user data' },
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
                  message: { type: 'string', example: 'User does not exist!' },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Internal Server Error' },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/users/delete/{userId}': {
    delete: {
      summary: 'Delete a user',
      tags: ['Admin'],
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          description: 'The ID of the user to delete',
          schema: {
            type: 'string',
            example: 'user-id',
          },
        },
      ],
      responses: {
        200: {
          description: 'User deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'User deleted successfully' },
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
                  error: { type: 'string', example: 'User not found!' },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Internal Server Error' },
                },
              },
            },
          },
        },
      },
    },
  },

    '/api/users/import': {
      post: {
        summary: 'Import users from a file',
        tags: ['Admin'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'The Excel file containing user data',
                  },
                },
                required: ['file'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Users imported successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Users uploaded and processed successfully!' },
                    processedUsers: { type: 'array', items: { type: 'object' } },
                    errors: { type: 'array', items: { type: 'object' } },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Invalid file selected.' },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'An error occurred during processing.' },
                    error: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/api/users/export': {
      get: {
        summary: 'Export users as an Excel file',
        tags: ['Admin'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'File downloaded successfully',
            content: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                schema: {
                  type: 'string',
                  format: 'binary',
                  description: 'The Excel file containing user data',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'An error occurred during processing.' },
                    error: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

