// export default ()=>({
//     database: process.env.DATABASE_NAME,
//     port : parseInt(process.env.DATABASE_PORT),
//     password : process.env.DATABASE_PASSWORD
// })
export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      password: process.env.DATABASE_PASSWORD,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      database : process.env.DATABASE_NAME
    }
  });