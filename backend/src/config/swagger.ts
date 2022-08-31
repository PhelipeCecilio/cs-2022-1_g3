import * as swaggerUI from "swagger-ui-express";

export const swaggerDocument: swaggerUI.JsonObject = {
    openapi: "3.0.1",
    info: {
        version: "1.0.0",
        title: "Foorum API Documentantion",
        description: "API do melhor forum sobre programacao da UFG",
        contact: {
            name: "Grupo 3",
            url: "https://foorumufg.vercel.app",
        },
        license: {
            name: "Apache 2.0",
            url: "https://www.apache.org/licenses/LICENSE-2.0.html",
        },
    },
    components: {
        schemas: {
            userToken: {
                type: "string",
                description: "JWT token",
                example: ""
            },
            name: {
                type: "string",
                description: "Nome do usuario",
                example: "John Doe",
            },
            email: {
                type: "string",
                description: "Email do usuario",
                example: "johnd@gmail.com",
            },
            password: {
                type: "string",
                description: "Senha do usuario",
                example: "123456",
            },
            user: {
                type: "object",
                properties: {
                    name: {
                        $ref: "#/components/schemas/name"
                    },
                    email: {
                        $ref: "#/components/schemas/email"
                    },
                    "password": {
                        $ref: "#/components/schemas/password"
                    }
                }
            },
            Signup: {
                type: "object",
                properties: {
                    name: {
                        $ref: "#/components/schemas/name"
                    },
                    email: {
                        $ref: "#/components/schemas/email"
                    },
                    "password": {
                        $ref: "#/components/schemas/password"
                    }
                }
            },
            SignupCreatedResponse: {
                type: "string",
                properties: {
                    message: "User {name} was created successfully!"
                }
            },
            SignupCreatedFailure: {
                type: "string",
                properties: {
                    message: "User already exists"
                }
            },
            errorSignup: {
                type: "object",
                properties: {
                    "error": {
                        "value": {},
                        "path": "password",
                        "type": "required",
                        "errors": [
                            "password is a required field"
                        ],
                        "params": {
                            "path": "password"
                        },
                        "inner": [],
                        "name": "ValidationError",
                        "message": "password is a required field"
                    }
                }

            },
            login: {
                type: "object",
                properties: {
                    email: {
                        $ref: "#/components/schemas/email"
                    },
                    password: {
                        $ref: "#/components/schemas/password"
                    }
                }
            }
        },
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    servers: [
        {
            url: "http://localhost:{port}/api",
            description: "The development API server",
            variables: {
                env: {
                    default: "development",
                    description: "DEV Environment",
                },
                port: {
                    default: "3000",
                },
            },
        },
        {
            url: "https://foorumufg.vercel.app",
            description: "The production API server",
            variables: {
                env: {
                    default: "production",
                    description: "Production Environment",
                },
            },
        },
    ], "paths": {

        "/signup": {
            "post": {
                "description": "Create a new User",
                "operationId": "createUser",
                "parameters": [],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Signup"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "The user has been created",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/SignupCreatedResponse"
                                },
                                example: {
                                    message: "User {name} was created successfully!"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "User already exists",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/SignupCreatedFailure"
                                },
                                "example": {
                                    $ref: "#/components/schemas/SignupCreatedFailure"
                                }
                            }
                        }
                    },
                    "409": {
                        "description": "Conflict",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/errorSignup"
                                },
                                "example": {
                                    $ref: "#/components/schemas/errorSignup"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/login": {
            "post": {
                "description": "login com usuario e senha",
                "operationId": "createUser",
                "parameters": [],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/login"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "login com sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                example: {
                                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbDdoMWJ4YzkwMDAyOG92dm8zdzV1dXJpIiwiaWF0IjoxNjYxOTE4MTY3LCJleHAiOjE2NjE5MjE3Njd9.A17mq8UnUcN2orO-UHc8I4PwNT6dJUba6AXxjiWx-II"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Password ou email incorreto",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                "example": {
                                    message: "Invalid password"
                                }
                            }
                        }
                    },
                }
            }
        },

        "/users": {
            "get": {
                "description": "Retorna uma lista de usuarios",
                "operationId": "user",
                "parameters": [],
                "responses": {
                    "200": {
                        "description": "Get sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                example: {
                                    users: ["#/components/schemas/user", "#/components/schemas/user"]
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Ususarios não encontrados",
                    "content": {
                        "application/json": {
                            "schema": {
                                $ref: "#/components/schemas/login"
                            },
                            "example": {
                                message: "no users found"
                            }
                        }
                    }
                },
            }
        },
        "/users/{email}": {
            "get": {
                "description": "Retorna um usuario pelo email",
                "operationId": "user",
                "parameters": {
                    in: "path",
                    name: "email",
                    description: "email do usuario",
                    required: true,
                },
                "responses": {
                    "200": {
                        "description": "Retorna um usuario com sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/user"
                                },
                                example: {
                                    $ref: "#/components/schemas/user"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Usuario não encontrado",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                "example": {
                                    message: "Invalid password"
                                }
                            }
                        }
                    },
                }
            },
            "put": {
                "description": "Substitui os dados de um usuario usando o email como identificador",
                "operationId": "user",
                "parameters": {
                    in: "path",
                    name: "email",
                    description: "email do usuario",
                    required: true,
                },
                "responses": {
                    "200": {
                        "description": "Login com sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                example: {
                                    message: "Put user {name} successfully!"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Usuario não encontrado",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                "example": {
                                    message: "User {name} not found!"
                                }
                            }
                        }
                    },
                }
            },
            "delete": {
                "description": "Deleta um usuario pelo email",
                "operationId": "user",
                "parameters": {
                    in: "path",
                    name: "email",
                    description: "email do usuario",
                    required: true,
                },
                "responses": {
                    "200": {
                        "description": "Deleta um usuario com sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/user"
                                },
                                example: {
                                    $ref: "#/components/schemas/user"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Usuario não encontrado",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                "example": {
                                    message: "Invalid password"
                                }
                            }
                        }
                    },
                }
            },
        },

        "/chats": {
            "post": {
                "description": "Cria um chat",
                "operationId": "chat",
                "parameters": [],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "chatName": "chat1"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "O chat foi criado com sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/SignupCreatedResponse"
                                },
                                example: {
                                    message: "Chat {id} was created successfully!"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Chat already exists",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/SignupCreatedFailure"
                                },
                                "example": {
                                    $ref: "#/components/schemas/SignupCreatedFailure"
                                }
                            }
                        }
                    },
                    "409": {
                        "description": "Conflict",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/errorSignup"
                                },
                                "example": {
                                    $ref: "#/components/schemas/errorSignup"
                                }
                            }
                        }
                    }
                }
            },
            "get": {
                "description": "Retorna uma lista de chats",
                "operationId": "chat",
                "parameters": [],
                "responses": {
                    "200": {
                        "description": "Get sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                example: {
                                    users: ["#/components/schemas/chat", "#/components/schemas/chat"]
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Chats não encontrados",
                    "content": {
                        "application/json": {
                            "schema": {
                                $ref: "#/components/schemas/login"
                            },
                            "example": {
                                message: "no chats found"
                            }
                        }
                    }
                },
            }
        },
        "/chats/{id}": {
            "get": {
                "description": "Retorna um chat pelo id",
                "operationId": "chat",
                "parameters": {
                    in: "path",
                    name: "id",
                    description: "id do chat",
                    required: true,
                },
                "responses": {
                    "200": {
                        "description": "Retorna um chat com sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/user"
                                },
                                example: {
                                    $ref: "#/components/schemas/user"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Chat não encontrado",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                "example": {
                                    message: "Chat não encontrado"
                                }
                            }
                        }
                    },
                }
            },
            "put": {
                "description": "Substitui os dados de um chat usando o id como identificador",
                "operationId": "chat",
                "parameters": {
                    in: "path",
                    name: "id",
                    description: "id do chat",
                    required: true,
                },
                "responses": {
                    "200": {
                        "description": "Atualiza um chat com sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                example: {
                                    message: "Put chat {id} successfully!"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "chat não encontrado",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                "example": {
                                    message: "chat {id} not found!"
                                }
                            }
                        }
                    },
                }
            },
            "delete": {
                "description": "Deleta um chat pelo id",
                "operationId": "chat",
                "parameters": {
                    in: "path",
                    name: "id",
                    description: "id do Chat",
                    required: true,
                },
                "responses": {
                    "200": {
                        "description": "Deleta um chat com sucesso",
                        "content": {
                            "application/json": {
                                "schema": {},
                                example: {}
                            }
                        }
                    },
                    "400": {
                        "description": "Chat não encontrado",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                "example": {
                                    message: "chat {id} not found!"
                                }
                            }
                        }
                    },
                }
            },
        },

        "/messages": {
            "post": {
                "description": "Cria uma mensagem para um chat",
                "operationId": "mensagem",
                "parameters": [],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "userId": "cl54zfa0900045ofmijypm7c2",
                                "chatId": "cl554c6b000009cfmwl767zrl",
                                "text": "Um texto de exemplo"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Mensagem criada com sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/SignupCreatedResponse"
                                },
                                example: {
                                    message: "Mensagem {id} was created successfully!"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Chat ou usuario não existe",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/SignupCreatedFailure"
                                },
                                "example": {
                                    $ref: "#/components/schemas/SignupCreatedFailure"
                                }
                            }
                        }
                    },
                }
            },
            "get": {
                "description": "Retorna uma lista de mensagens de um chat",
                "operationId": "mensagem",
                "parameters": [],
                "responses": {
                    "200": {
                        "description": "Get sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                example: {
                                    users: ["#/components/schemas/mensagem", "#/components/schemas/mensagem"]
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Chats não encontrados",
                    "content": {
                        "application/json": {
                            "schema": {
                                $ref: "#/components/schemas/login"
                            },
                            "example": {
                                message: "no chats found"
                            }
                        }
                    }
                },
            }
        },
        "/messages/{id}": {
            "get": {
                "description": "Retorna uma mensagem pelo id",
                "operationId": "mensagem",
                "parameters": {
                    in: "path",
                    name: "id",
                    description: "id da mensagem",
                    required: true,
                },
                "responses": {
                    "200": {
                        "description": "Retorna uma mensagem com sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/mensagem"
                                },
                                example: {
                                    $ref: "#/components/schemas/mensagem"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Mensagem não encontrado",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/mensagem"
                                },
                                "example": {
                                    message: "mensagem não encontrada"
                                }
                            }
                        }
                    },
                }
            },
            "put": {
                "description": "Substitui os dados de um mensagem usando o id como identificador",
                "operationId": "mensagem",
                "parameters": {
                    in: "path",
                    name: "id",
                    description: "id do mensagem",
                    required: true,
                },
                "responses": {
                    "200": {
                        "description": "Atualiza uma mensagem com sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                example: {
                                    message: "Put mensagem {id} successfully!"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Mensagem não encontrado",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/mensagem"
                                },
                                "example": {
                                    message: "Mensagem {id} not found!"
                                }
                            }
                        }
                    },
                }
            },
            "delete": {
                "description": "Deleta uma mensagem pelo id",
                "operationId": "mensagem",
                "parameters": {
                    in: "path",
                    name: "id",
                    description: "id do mensagem",
                    required: true,
                },
                "responses": {
                    "200": {
                        "description": "Deleta uma mensagem com sucesso",
                        "content": {
                            "application/json": {
                                "schema": {},
                                example: {}
                            }
                        }
                    },
                    "400": {
                        "description": "Mensagem não encontrado",
                        "content": {
                            "application/json": {
                                "schema": {
                                    $ref: "#/components/schemas/login"
                                },
                                "example": {
                                    message: "Mensagem {id} not found!"
                                }
                            }
                        }
                    },
                }
            },
        },

    }
};
