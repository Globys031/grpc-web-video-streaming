
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
      Auth_frontend_port: string;
      Auth_frontend_ssl_port: string;
      Auth_backend_port: string;
      Auth_backend_ssl_port: string;
      Streaming_frontend_port: string;
      Streaming_frontend_ssl_port: string;
      Streaming_backend_port: string;
      Streaming_backend_ssl_port: string;
      Chat_frontend_port: string;
      Chat_frontend_ssl_port: string;
      Chat_backend_port: string;
      Chat_backend_ssl_port: string;
      Comment_frontend_port: string;
      Comment_frontend_ssl_port: string;
      Comment_backend_port: string;
      Comment_backend_ssl_port: string;
      Postgre_port: string;
      Adminer_port: string;

      // remove later
      REACT_APP_NOT_SECRET_CODE: string;
    }
  }
}