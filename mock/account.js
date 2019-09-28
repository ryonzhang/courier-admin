import { Mock, Constant, qs, randomAvatar } from './_utils'

const { ApiPrefix } = Constant
const fetch = require("node-fetch")

let mockMode = false

let accountsListData = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      msisdn: /^1[34578]\d{9}$/,
      'core_balance|11-99': 1,
      active: '@boolean',
      created_at: '@datetime',
      updated_at: '@datetime',
      expired_at: '@datetime',
      avatar() {
        return randomAvatar()
      },
    },
  ],
})

let database = accountsListData.data

const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'guest',
  DEVELOPER: 'developer',
}

const accountPermission = {
  DEFAULT: {
    visit: ['1', '2', '21', '7', '5', '51', '52', '53'],
    role: EnumRoleType.DEFAULT,
  },
  ADMIN: {
    role: EnumRoleType.ADMIN,
  },
  DEVELOPER: {
    role: EnumRoleType.DEVELOPER,
  },
}

const adminUsers = [
  {
    id: 0,
    username: 'admin',
    password: 'admin',
    permissions: accountPermission.ADMIN,
    avatar: randomAvatar(),
  },
  {
    id: 1,
    username: 'guest',
    password: 'guest',
    permissions: accountPermission.DEFAULT,
    avatar: randomAvatar(),
  },
  {
    id: 2,
    username: '吴彦祖',
    password: '123456',
    permissions: accountPermission.DEVELOPER,
    avatar: randomAvatar(),
  },
]

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] === key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}

module.exports = {
  [`POST ${ApiPrefix}/user/login`](req, res) {
    const { username, password } = req.body
    const user = adminUsers.filter(item => item.username === username)

    if (user.length > 0 && user[0].password === password) {
      const now = new Date()
      now.setDate(now.getDate() + 1)
      res.cookie(
        'token',
        JSON.stringify({ id: user[0].id, deadline: now.getTime() }),
        {
          maxAge: 900000,
          httpOnly: true,
        }
      )
      res.json({ success: true, message: 'Ok' })
    } else {
      res.status(400).end()
    }
  },

  [`GET ${ApiPrefix}/user/logout`](req, res) {
    res.clearCookie('token')
    res.status(200).end()
  },

  [`GET ${ApiPrefix}/user`](req, res) {
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const response = {}
    let user = {}
    if (!cookies.token) {
      res.status(200).send({ message: 'Not Login' })
      return
    }
    const token = JSON.parse(cookies.token)
    if (token) {
      response.success = token.deadline > new Date().getTime()
    }
    if (response.success) {
      const userItem = adminUsers.find(_ => _.id === token.id)
      if (userItem) {
        const { password, ...other } = userItem
        user = other
      }
    }
    response.user = user
    res.json(response)
  },

  async [`GET ${ApiPrefix}/accounts`](req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1
    let newData = database
    if(!mockMode){
      await fetch('http://localhost:8080/accounts')
        .then(response => {
          return response.json()
        })
        .then(data => {
          newData= data['data']
        });
    }

    newData.forEach(d=>d.avatar=randomAvatar())


    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  async[`POST ${ApiPrefix}/account`](req, res) {
    const newData = req.body
    newData.created_at = Mock.mock('@now')
    newData.updated_at = Mock.mock('@now')
    newData.expired_at = Mock.mock('@now')
    newData.avatar =
      newData.avatar ||
      Mock.Random.image(
        '100x100',
        Mock.Random.color(),
        '#757575',
        'png',
      )
    newData.id = Mock.mock('@id')

    await fetch('http://localhost:8080/account', {
      method: 'POST',
      body: JSON.stringify(newData),
    })
      .then(response => {
        return response.json()
      })
      .then(d => {
        console.log(d)
      });

    database.unshift(newData)

    res.status(200).end()
  },

  [`POST ${ApiPrefix}/accounts/delete`](req, res) {
    const { ids=[] } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },

  [`POST ${ApiPrefix}/accounts`](req, res) {
    const newData = req.body
    newData.createTime = Mock.mock('@now')
    newData.avatar =
      newData.avatar ||
      Mock.Random.image(
        '100x100',
        Mock.Random.color(),
        '#757575',
        'png',
        newData.nickName.substr(0, 1)
      )
    newData.id = Mock.mock('@id')

    database.unshift(newData)

    res.status(200).end()
  },

  async [`GET ${ApiPrefix}/account/:id`](req, res) {
    const { id } = req.params
    let data = queryArray(database, id, 'id')
    if(!mockMode){
      await fetch('http://localhost:8080/account/'+id)
        .then(response => {
          return response.json();
        })
        .then(d => {
          data= d['data']
        });
      await fetch('http://localhost:8080/packages/'+data.msisdn)
        .then(response => {
          return response.json();
        })
        .then(d => {
          data.packages= d['data']
        });
      await fetch('http://localhost:8080/packages/')
        .then(response => {
          return response.json();
        })
        .then(d => {
          data.all_packages= d['data']
        });


    }
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(200).json(NOTFOUND)
    }
  },

  [`DELETE ${ApiPrefix}/account/:id`](req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(200).json(NOTFOUND)
    }
  },

  [`PATCH ${ApiPrefix}/account/:id`](req, res) {
    const { id } = req.params
    const editItem = req.body
    let isExist = false

    database = database.map(item => {
      if (item.id === id) {
        isExist = true
        return Object.assign({}, item, editItem)
      }
      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(200).json(NOTFOUND)
    }
  },
}
