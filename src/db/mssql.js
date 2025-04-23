const sql = require('mssql')
const { DBGet, DBCloseAll } = require('./pool-manager')
require('dotenv').config()

const docSQLConfig = {
    user: process.env.DOC_USER,
    password: process.env.DOC_PASSWORD,
    database: process.env.DOC_DATABASE,
    server: process.env.DOC_SERVER,
    options: {
      trustServerCertificate: true
    }
  }
  
  const tdocSQLConfig = {
    user: process.env.TDOC_USER,
    password: process.env.TDOC_PASSWORD,
    database: process.env.TDOC_DATABASE,
    server: process.env.TDOC_SERVER,
    options: {
      trustServerCertificate: true
    }
  }
  
  const inJungliSQLConfig = {
    user: process.env.INJUNGLI_USER,
    password: process.env.INJUNGLI_PASSWORD,
    database: process.env.INJUNGLI_DATABASE,
    server: process.env.INJUNGLI_SERVER,
    options: {
      trustServerCertificate: true
    }
  }

  const ssmsSQLConfig = {
    user: process.env.SSMS_USER,
    password: process.env.SSMS_PASSWORD,
    database: process.env.SSMS_DATABASE,
    server: process.env.SSMS_SERVER,
    port: 1521,
    options: {
      trustServerCertificate: true
    }
  }

  module.exports = {
    docSQLConfig,
    tdocSQLConfig,
    inJungliSQLConfig,
    ssmsSQLConfig
  }