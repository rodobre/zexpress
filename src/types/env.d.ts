declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number
    NODE_ENV: 'production' | 'development'
  }
}
