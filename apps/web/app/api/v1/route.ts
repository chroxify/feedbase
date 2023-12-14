import { NextResponse } from 'next/server';
import { OpenAPIV3 } from 'openapi-types';

/*
  OpenAPI Documentation
*/
export function GET(): NextResponse<OpenAPIV3.Document> {
  return NextResponse.json({
    openapi: '3.0.0',
    info: {
      title: 'Feedbase API',
      description: 'Feedbase API Documentation',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://api.feedbase.app/v1',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      '/{projectSlug}/atom': {
        get: {
          description: 'Generate atom feed for project changelog',
          operationId: 'getProjectChangelogsAtom',
          security: [],
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/atom+xml': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/{projectSlug}/changelogs': {
        get: {
          description: 'Get public project changelogs',
          operationId: 'getPublicProjectChangelogs',
          security: [],
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Changelog',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{projectSlug}': {
        get: {
          description: 'Get a project by slug',
          operationId: 'getProjectBySlug',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Project',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        patch: {
          description: 'Update a project by slug',
          operationId: 'updateProjectBySlug',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Project object that needs to be updated',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProjectUpdate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Project',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          description: 'Delete a project by slug',
          operationId: 'deleteProjectBySlug',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Project',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{projectSlug}/changelogs': {
        get: {
          description: 'Get all project changelogs',
          operationId: 'getProjectChangelogs',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/ChangelogWithAuthor',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        post: {
          description: 'Create project changelog',
          operationId: 'createProjectChangelog',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Changelog object that needs to be created',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ChangelogCreate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Changelog',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{projectSlug}/changelogs/{changelogId}': {
        put: {
          description: 'Update project changelog by id',
          operationId: 'updateProjectChangelogById',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'changelogId',
              in: 'path',
              description: 'Changelog id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Changelog object that needs to be updated',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ChangelogUpdate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Changelog',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug or changelog id supplied',
            },
            404: {
              description: 'Project or changelog not found',
            },
          },
        },
        delete: {
          description: 'Delete project changelog by id',
          operationId: 'deleteProjectChangelogById',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'changelogId',
              in: 'path',
              description: 'Changelog id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Changelog',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug or changelog id supplied',
            },
            404: {
              description: 'Project or changelog not found',
            },
          },
        },
      },
      '/projects/{projectSlug}/config': {
        get: {
          description: 'Get project config',
          operationId: 'getProjectConfig',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ProjectConfig',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        patch: {
          description: 'Update project config',
          operationId: 'updateProjectConfig',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Project config object that needs to be updated',
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/ProjectConfigUpdate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    $ref: '#/components/schemas/ProjectConfig',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{projectSlug}/feedback': {
        get: {
          description: 'Get all project feedback',
          operationId: 'getProjectFeedback',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/FeedbackWithUser',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        post: {
          description: 'Create project feedback',
          operationId: 'createProjectFeedback',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Feedback object that needs to be created',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FeedbackCreate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Feedback',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{projectSlug}/feedback/{feedbackId}': {
        get: {
          description: 'Get project feedback by id',
          operationId: 'getProjectFeedbackById',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'feedbackId',
              in: 'path',
              description: 'Feedback id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/FeedbackWithUser',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug or feedback id supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Feedback not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        patch: {
          description: 'Update project feedback by id',
          operationId: 'updateProjectFeedbackById',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'feedbackId',
              in: 'path',
              description: 'Feedback id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Feedback object that needs to be updated',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FeedbackUpdate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Feedback',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug or feedback id supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Feedback not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          description: 'Delete project feedback by id',
          operationId: 'deleteProjectFeedbackById',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'feedbackId',
              in: 'path',
              description: 'Feedback id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Feedback',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug or feedback id supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Feedback not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{projectSlug}/feedback/{feedbackId}/comments': {
        get: {
          description: 'Get feedback comments',
          operationId: 'getFeedbackComments',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'feedbackId',
              in: 'path',
              description: 'Feedback id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/FeedbackCommentWithUser',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug or feedback id supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project or feedback not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{projectSlug}/feedback/{feedbackId}/comments/{commentId}': {
        delete: {
          description: 'Delete project feedback comment by id',
          operationId: 'deleteProjectFeedbackCommentById',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'feedbackId',
              in: 'path',
              description: 'Feedback id',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'commentId',
              in: 'path',
              description: 'Comment id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/FeedbackComment',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug or feedback id supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project or feedback not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{projectSlug}/feedback/{feedbackId}/upvotes': {
        get: {
          description: 'Get feedback upvoters',
          operationId: 'getFeedbackUpvoters',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'feedbackId',
              in: 'path',
              description: 'Feedback id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/FeedbackUpvotes',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug or feedback id supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Feedback not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{projectSlug}/feedback/tags': {
        get: {
          description: 'Get feedback tags',
          operationId: 'getFeedbackTags',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/FeedbackTag',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        post: {
          description: 'Create feedback tag',
          operationId: 'createFeedbackTag',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Feedback tag object that needs to be created',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FeedbackTagCreate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/FeedbackTag',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{projectSlug}/feedback/tags/{tagName}': {
        delete: {
          description: 'Delete feedback tag by name',
          operationId: 'deleteFeedbackTagByName',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'tagName',
              in: 'path',
              description: 'Tag name',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/FeedbackTag',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug or tag name supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project or tag not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{projectSlug}/invites': {
        get: {
          description: 'List project team invites',
          operationId: 'getProjectInvites',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/ExtendedProjectInvite',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        post: {
          description: 'Create a project invite',
          operationId: 'createProjectInvite',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Project invite object that needs to be created',
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ProjectInvite',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{projectSlug}/invites/{inviteId}': {
        delete: {
          description: 'Delete project invite by id',
          operationId: 'deleteProjectInviteById',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'inviteId',
              in: 'path',
              description: 'Invite id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ProjectInvite',
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{projectSlug}/members': {
        get: {
          description: 'Get project members',
          operationId: 'getProjectMembers',
          parameters: [
            {
              name: 'projectSlug',
              in: 'path',
              description: 'Project slug',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/ProjectMember',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid project slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            slug: {
              type: 'string',
            },
            icon: {
              type: 'string',
            },
            icon_radius: {
              type: 'string',
            },
            og_image: {
              type: 'string',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ProjectUpdate: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            slug: {
              type: 'string',
            },
            icon: {
              type: 'string',
            },
            icon_radius: {
              type: 'string',
            },
            og_image: {
              type: 'string',
            },
          },
        },
        Changelog: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            project_id: {
              type: 'string',
              format: 'uuid',
            },
            author_id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            slug: {
              type: 'string',
            },
            summary: {
              type: 'string',
            },
            content: {
              type: 'string',
            },
            image: {
              type: 'string',
            },
            publish_date: {
              type: 'string',
              format: 'date-time',
            },
            published: {
              type: 'boolean',
            },
          },
        },
        ChangelogWithAuthor: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            project_id: {
              type: 'string',
              format: 'uuid',
            },
            author_id: {
              type: 'string',
              format: 'uuid',
            },
            author: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                email: {
                  type: 'string',
                },
                full_name: {
                  type: 'string',
                },
                avatar_url: {
                  type: 'string',
                },
              },
            },
            title: {
              type: 'string',
            },
            slug: {
              type: 'string',
            },
            summary: {
              type: 'string',
            },
            content: {
              type: 'string',
            },
            image: {
              type: 'string',
            },
            publish_date: {
              type: 'string',
              format: 'date-time',
            },
            published: {
              type: 'boolean',
            },
          },
        },
        ChangelogCreate: {
          type: 'object',
          required: ['title', 'summary', 'content', 'published'],
          properties: {
            title: {
              type: 'string',
            },
            summary: {
              type: 'string',
            },
            content: {
              type: 'string',
            },
            image: {
              type: 'string',
            },
            publish_date: {
              type: 'string',
              format: 'date-time',
            },
            published: {
              type: 'boolean',
            },
          },
        },
        ChangelogUpdate: {
          type: 'object',
          required: ['title', 'summary', 'content', 'published'],
          properties: {
            title: {
              type: 'string',
            },
            summary: {
              type: 'string',
            },
            content: {
              type: 'string',
            },
            image: {
              type: 'string',
            },
            publish_date: {
              type: 'string',
              format: 'date-time',
            },
            published: {
              type: 'boolean',
            },
          },
        },
        ProjectConfig: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            project_id: {
              type: 'string',
              format: 'uuid',
            },
            changelog_preview_style: {
              type: 'string',
            },
            changelog_twitter_handle: {
              type: 'string',
            },
            custom_domain: {
              type: 'string',
            },
            custom_domain_verified: {
              type: 'boolean',
            },
            integration_discord_role_id: {
              type: 'string',
            },
            integration_discord_status: {
              type: 'boolean',
            },
            integration_discord_webhook: {
              type: 'string',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ProjectConfigUpdate: {
          type: 'object',
          properties: {
            changelog_preview_style: {
              type: 'string',
            },
            changelog_twitter_handle: {
              type: 'string',
            },
          },
        },
        Feedback: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            project_id: {
              type: 'string',
              format: 'uuid',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            status: {
              type: 'string',
            },
            upvotes: {
              type: 'number',
            },
            comment_count: {
              type: 'number',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FeedbackWithUser: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            project_id: {
              type: 'string',
              format: 'uuid',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                email: {
                  type: 'string',
                },
                full_name: {
                  type: 'string',
                },
                avatar_url: {
                  type: 'string',
                },
              },
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            tags: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  color: {
                    type: 'string',
                  },
                },
              },
            },
            status: {
              type: 'string',
            },
            upvotes: {
              type: 'number',
            },
            comment_count: {
              type: 'number',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FeedbackCreate: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            status: {
              type: 'string',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        FeedbackUpdate: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            status: {
              type: 'string',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        FeedbackComment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            feedback_id: {
              type: 'string',
              format: 'uuid',
            },
            reply_to_id: {
              type: 'string',
              format: 'uuid',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
            },
            content: {
              type: 'string',
            },
            upvotes: {
              type: 'number',
            },
            upvoters: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FeedbackCommentWithUser: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            feedback_id: {
              type: 'string',
              format: 'uuid',
            },
            reply_to_id: {
              type: 'string',
              format: 'uuid',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                email: {
                  type: 'string',
                },
                full_name: {
                  type: 'string',
                },
                avatar_url: {
                  type: 'string',
                },
              },
            },
            has_upvoted: {
              type: 'boolean',
            },
            content: {
              type: 'string',
            },
            upvotes: {
              type: 'number',
            },
            upvoters: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            replies: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FeedbackUpvotes: {
          type: 'object',
          properties: {
            upvotes: {
              type: 'number',
            },
            upvoters: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid',
                  },
                  email: {
                    type: 'string',
                  },
                  full_name: {
                    type: 'string',
                  },
                  avatar_url: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        FeedbackTag: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            project_id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            color: {
              type: 'string',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FeedbackTagCreate: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            color: {
              type: 'string',
            },
          },
        },
        ProjectInvite: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            project_id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
            },
            accepted: {
              type: 'boolean',
            },
            creator_id: {
              type: 'string',
              format: 'uuid',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ExtendedProjectInvite: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            project_id: {
              type: 'string',
              format: 'uuid',
            },
            project: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                slug: {
                  type: 'string',
                },
                icon: {
                  type: 'string',
                },
              },
            },
            email: {
              type: 'string',
            },
            accepted: {
              type: 'boolean',
            },
            creator_id: {
              type: 'string',
              format: 'uuid',
            },
            creator: {
              type: 'object',
              properties: {
                full_name: {
                  type: 'string',
                },
              },
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ProjectMember: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
            },
            full_name: {
              type: 'string',
            },
            avatar_url: {
              type: 'string',
            },
            joined_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
  });
}
