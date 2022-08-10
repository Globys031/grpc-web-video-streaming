
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: 'dev' | 'prod';
      Database_URL: string;
      // JWT_secret_key: string;
      Gateway_frontend_port: string;
      Gateway_frontend_ssl_port: string;
      Gateway_backend_port: string;
      Gateway_backend_ssl_port: string;
      Auth_port: string;
      Auth_ssl_port: string;
      Streaming_port: string;
      Streaming_ssl_port: string;
      Chat_port: string;
      Chat_ssl_port: string;
      Comment_port: string;
      Comment_ssl_port: string;
      Postgre_port: string;
      Adminer_port: string;
    }
  }
}