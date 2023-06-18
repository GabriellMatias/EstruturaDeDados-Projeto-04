import readline from 'readline'

interface Product {
  name: string
  description: string
  weight: number
  purchaseValue: number
  saleValue: number
  profit: number
  profitPercentage: number
  manufacturerId: number
}

interface UF {
  abbreviation: string
  name: string
}

interface Manufacturer {
  code: number
  brand: string
  website: string
  phone: number
  uf: UF
}

interface Customer {
  id: number
  name: string
  age: number
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const ANSII_RED = '\x1b[31m%s\x1b[0m'
const ANSII_GREEN = '\x1b[32m%s\x1b[0m'

const products: Product[] = []
const manufacturers: Manufacturer[] = []
const ufs: UF[] = []
const customers: Customer[] = []
const seniorCustomers: Customer[] = []

async function printLine(prompt: string | number): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt.toString(), (input) => {
      resolve(input.trim())
    })
  })
}

async function validaNum(input: string | number, inputName: string) {
  while (isNaN(Number(input))) {
    console.log(ANSII_RED, '------------------------------')
    console.log(ANSII_RED, '| ACEITAMOS APENAS NUMEROS ⚠️ |')
    console.log(ANSII_RED, '------------------------------')
    input = parseFloat(await printLine(`Informe ${inputName} novamente :`))
  }
  return Number(input)
}
async function validaStr(input: string | number, inputName: string) {
  const onlyLetters = /^[A-Za-z]+$/

  while (!onlyLetters.test(String(input))) {
    console.log(ANSII_RED, '------------------------------')
    console.log(ANSII_RED, '| ACEITAMOS APENAS STRINGS ⚠️ |')
    console.log(ANSII_RED, '------------------------------')
    input = await printLine(`Informe ${inputName} novamente :`)
  }
  return String(input)
}

async function registerProduct(): Promise<void> {
  if (manufacturers.length === 0) {
    console.log(
      ANSII_RED,
      '\n--------------------------------------------------------------------',
    )
    console.log(
      ANSII_RED,
      '| Primeiro registre uma fabrica 🏛️ para poder registrar um produto |',
    )
    console.log(
      ANSII_RED,
      '--------------------------------------------------------------------',
    )
    return
  } else if (manufacturers.length < 2) {
    console.log(
      ANSII_RED,
      '\n----------------------------------------------------------------------------------------------',
    )
    console.log(
      ANSII_RED,
      '| Voce necessita de no minimo [02] fabricantes cadastrados para poder registar um produto ❌ |',
    )
    console.log(
      ANSII_RED,
      '----------------------------------------------------------------------------------------------',
    )
    return
  }
  const product: Product = {} as Product
  product.name = await validaStr(
    await printLine('Insira o nome do produto 📋 : '),
    'o nome',
  )

  product.description = await validaStr(
    await printLine('Insira a Descricao do produto 📋 : '),
    'a descricao',
  )

  product.weight = await validaNum(
    parseFloat(await printLine('Informe o peso do produto 🏋️ :')),
    'o peso',
  )

  product.purchaseValue = await validaNum(
    parseFloat(await printLine('Insira o valor de [COMPRA] do produto 🛒:')),
    'o valor de compra',
  )

  product.saleValue = await validaNum(
    parseFloat(await printLine('Insira o valor de [VENDA] do produto 🎫:')),
    'o valor de venda',
  )

  // CALCULO PARA PROFIT
  product.profit = product.saleValue - product.purchaseValue
  product.profitPercentage = (product.profit / product.purchaseValue) * 100

  const manufacturerCode = await validaNum(
    parseInt(await printLine('Insira o codigo da fabrica do produto :')),
    'o codigo da fabrica',
  )

  const manufacturer = manufacturers.find((m) => m.code === manufacturerCode)
  if (!manufacturer) {
    console.log(
      ANSII_RED,
      '\n---------------------------------------------------------',
    )
    console.log(
      ANSII_RED,
      '| Fabrica NAO ENCONTRADA, VERIFIQUE O CODIGO FORNECIDO! |',
    )
    console.log(
      ANSII_RED,
      '---------------------------------------------------------',
    )
    return
  }
  product.manufacturerId = manufacturer.code
  products.push(product)
  console.log(ANSII_GREEN, '\n---------------------------------------')
  console.log(ANSII_GREEN, '| Produto registrado com sucesso ✅ ! |')
  console.log(ANSII_GREEN, '---------------------------------------')
}

function listProducts(): void {
  if (products.length === 0) {
    console.log(ANSII_RED, '\n---------------------------------------')
    console.log(ANSII_RED, '|     Lista de produtos Vazia  !      |')
    console.log(ANSII_RED, '---------------------------------------')
  } else {
    console.log(ANSII_GREEN, '\n---------------------------------------')
    console.log(ANSII_GREEN, '|    Listando Todos Produtos...       |')
    console.log(ANSII_GREEN, '---------------------------------------')
    products.forEach((product) => {
      console.log(`\n| Nome            | ${product.name}`)
      console.log('---------------------------------------')
      console.log(`| Descricao       | ${product.description}`)
      console.log('---------------------------------------')
      console.log(ANSII_RED, `| FabricaId       | ${product.manufacturerId}`)
      console.log('---------------------------------------')
      console.log(`| Profit          | ${product.profit}`)
      console.log('---------------------------------------')
      console.log(`| Profit em %     | ${product.profitPercentage.toFixed(2)}`)
      console.log('---------------------------------------')
      console.log(`| Valor de Compra | ${product.purchaseValue}`)
      console.log('---------------------------------------')
      console.log(`| Valor de Venda  | ${product.saleValue}`)
      console.log('---------------------------------------')
      console.log(`| Peso            | ${product.weight}`)
      console.log('---------------------------------------')
    })
  }
}

async function registerManufacturer(): Promise<void> {
  if (ufs.length === 0) {
    console.log(
      ANSII_RED,
      '------------------------------------------------------',
    )
    console.log(
      ANSII_RED,
      '| Voce deve cadastrar uma UF antes de prosseguir 🗺️! |',
    )
    console.log(
      ANSII_RED,
      '------------------------------------------------------',
    )
    return
  }
  if (manufacturers.length >= 5) {
    console.log(
      ANSII_RED,
      '----------------------------------------------------',
    )
    console.log(
      ANSII_RED,
      '| ❌ Numero MAXIMO de Fabricas Ja cadastradas ❌! |',
    )
    console.log(
      ANSII_RED,
      '----------------------------------------------------',
    )
    return
  }

  const manufacturer: Manufacturer = {} as Manufacturer
  manufacturer.code = await validaNum(
    parseInt(await printLine('Insira o codigo - [ID] da Fabrica 🏛️ : ')),
    'o codigo da fabrica',
  )
  manufacturer.brand = await validaStr(
    await printLine('Insira a logo - [Nome] da fabrica :'),
    'o nome',
  )
  manufacturer.website = await validaStr(
    await printLine('Insira o Site da fabrica 🌎:'),
    'o site',
  )
  manufacturer.phone = await validaNum(
    await printLine('Insira o numero de telefone da Fabrica 📱:'),
    'o numero',
  )

  const ufAbbreviation = await validaStr(
    await printLine('Insira em qual UF a fabrica se localiza 🗺️:'),
    'qual a UF',
  )
  const uf = ufs.find((u) => u.abbreviation === ufAbbreviation)
  if (!uf) {
    console.log(
      ANSII_RED,
      '------------------------------------------------------',
    )
    console.log(
      ANSII_RED,
      '| UF nao encontrada, certifique-se que esta digitando uma UF valida! |',
    )
    console.log(
      ANSII_RED,
      '------------------------------------------------------',
    )
    return
  }
  manufacturer.uf = uf
  manufacturers.push(manufacturer)
  console.log(ANSII_GREEN, '---------------------------------------')
  console.log(ANSII_GREEN, '| Fabrica registrada com sucesso ✅ ! |')
  console.log(ANSII_GREEN, '---------------------------------------')
}

function listManufacturers(): void {
  if (manufacturers.length === 0) {
    console.log(ANSII_RED, '\n---------------------------------------')
    console.log(ANSII_RED, '|     Lista de Fabricas Vazia  !      |')
    console.log(ANSII_RED, '---------------------------------------')
  } else {
    console.log(ANSII_GREEN, '\n---------------------------------------')
    console.log(ANSII_GREEN, '|    Listando Todas as fabricas...    |')
    console.log(ANSII_GREEN, '---------------------------------------')
    manufacturers.forEach((manufacturer) => {
      console.log(`\n| Marca/Logo      | ${manufacturer.brand}`)
      console.log('---------------------------------------')
      console.log(`| Telefone        | ${manufacturer.phone}`)
      console.log('---------------------------------------')
      console.log(ANSII_RED, `| FabricaId       | ${manufacturer.code}`)
      console.log('---------------------------------------')
      console.log(`| UF              | ${manufacturer.uf.abbreviation}`)
      console.log('---------------------------------------')
      console.log(`| Website         | ${manufacturer.website}`)
      console.log('---------------------------------------')
    })
  }
}
async function registerUF(): Promise<void> {
  const uf: UF = {} as UF
  uf.abbreviation = await validaStr(
    await printLine('Insira a abreviacao da UF :'),
    'a UF',
  )
  uf.name = await validaStr(
    await printLine('Insira o nome da UF :'),
    'o nome da UF',
  )
  ufs.push(uf)
  console.log(ANSII_GREEN, '\n---------------------------------------')
  console.log(ANSII_GREEN, '|   UF registrada com sucesso ✅ !    |')
  console.log(ANSII_GREEN, '---------------------------------------')
}

function listUfs(): void {
  if (ufs.length === 0) {
    console.log(ANSII_RED, '\n---------------------------------------')
    console.log(ANSII_RED, '|       Lista de UFS Vazia  !         |')
    console.log(ANSII_RED, '---------------------------------------')
  } else {
    console.log(ANSII_GREEN, '\n---------------------------------------')
    console.log(ANSII_GREEN, '|    Listando Todas as UFS...         |')
    console.log(ANSII_GREEN, '---------------------------------------')
    ufs.forEach((uf) => {
      console.log(`\n| Nome            | ${uf.name}`)
      console.log('---------------------------------------')
      console.log(ANSII_RED, `| Sigla           | ${uf.abbreviation}`)
      console.log('---------------------------------------')
    })
  }
}

async function registerCustomer(): Promise<void> {
  if (customers.length >= 30) {
    console.log(
      ANSII_RED,
      '\n------------------------------------------------------',
    )
    console.log(
      ANSII_RED,
      '|  Numero MAXIMO de Clientes cadastrados Atingido!  |',
    )
    console.log(
      ANSII_RED,
      '------------------------------------------------------',
    )
    return
  }
  const id = await validaNum(
    await printLine('Informe o ID do cliente: '),
    'o id',
  )
  const name = await validaStr(
    await printLine('Informe o nome do cliente: '),
    'o nome',
  )
  const age = await validaNum(
    await printLine('Informe a Idade do cliente 🔞: '),
    'a idade',
  )

  const customer: Customer = {
    id,
    name,
    age,
  }
  customers.push(customer)
  console.log(ANSII_GREEN, '\n--------------------------------------------')
  console.log(ANSII_GREEN, '|   Cliente registrado com sucesso ✅ !    |')
  console.log(ANSII_GREEN, '--------------------------------------------')
}
function listSeniorCustomers() {
  if (seniorCustomers.length === 0) {
    console.log(ANSII_RED, '\n--------------------------------------------')
    console.log(ANSII_RED, '|       Nao ha clientes cadastrados        |')
    console.log(ANSII_RED, '--------------------------------------------')
  } else {
    console.log(ANSII_GREEN, '\n---------------------------------------')
    console.log(ANSII_GREEN, '|    Listando Todos os clientes...    |')
    console.log(ANSII_GREEN, '---------------------------------------')
    seniorCustomers.forEach((customer) => {
      console.log(`\n| Nome            | ${customer.name}`)
      console.log('---------------------------------------')
      console.log(ANSII_RED, `| Id              | ${customer.id}`)
      console.log('---------------------------------------')
      console.log(`| Idade           | ${customer.age}`)
      console.log('---------------------------------------')
    })
  }
}
function listCustomers() {
  if (customers.length === 0) {
    console.log(ANSII_RED, '\n--------------------------------------------')
    console.log(ANSII_RED, '|       Nao ha clientes cadastrados        |')
    console.log(ANSII_RED, '--------------------------------------------')
  } else {
    console.log(ANSII_GREEN, '\n---------------------------------------')
    console.log(ANSII_GREEN, '|    Listando Todos os clientes...    |')
    console.log(ANSII_GREEN, '---------------------------------------')
    customers.forEach((customer) => {
      console.log(`\n| Nome            | ${customer.name}`)
      console.log('---------------------------------------')
      console.log(ANSII_RED, `| Id              | ${customer.id}`)
      console.log('---------------------------------------')
      console.log(`| Idade           | ${customer.age}`)
      console.log('---------------------------------------')
    })
  }
}

async function listProductsByManufacturer() {
  const manufacturerCode = validaNum(
    await printLine('Insira o codigo da Fabrica: '),
    'o codigo da fabrica',
  )

  const filteredProducts = products.filter(
    (product) => product.manufacturerId === Number(manufacturerCode),
  )

  const sortedProducts = filteredProducts.sort((a, b) =>
    a.name.localeCompare(b.name),
  )
  if (!sortedProducts) {
    console.log(
      ANSII_RED,
      '\n---------------------------------------------------------------------------------------------',
    )
    console.log(
      ANSII_RED,
      '|   Nao encontramos nenhum produto cadastrado nessa fabrica, verifique o codigo fornecido   |',
    )
    console.log(
      ANSII_RED,
      '---------------------------------------------------------------------------------------------',
    )
  } else {
    sortedProducts.forEach((product) => {
      console.log(ANSII_GREEN, '\n---------------------------------------')
      console.log(ANSII_GREEN, '|        Produto Encontrado!!         |')
      console.log(ANSII_GREEN, '---------------------------------------')
      console.log(`\n| Nome            | ${product.name}`)
      console.log('---------------------------------------')
      console.log(`| Descricao       | ${product.description}`)
      console.log('---------------------------------------')
      console.log(ANSII_RED, `| FabricaId       | ${product.manufacturerId}`)
      console.log('---------------------------------------')
      console.log(`| Profit          | ${product.profit}`)
      console.log('---------------------------------------')
      console.log(`| Profit em %     | ${product.profitPercentage}`)
      console.log('---------------------------------------')
      console.log(`| Valor de Compra | ${product.purchaseValue}`)
      console.log('---------------------------------------')
      console.log(`| Valor de Venda  | ${product.saleValue}`)
      console.log('---------------------------------------')
      console.log(`| Peso       | ${product.weight}`)
      console.log('---------------------------------------')
    })
  }
}

async function findStatesWithHighestValueProduct() {
  if (products.length === 0) {
    console.log(ANSII_RED, '\n---------------------------------------')
    console.log(ANSII_RED, '|     Lista de produtos Vazia  !      |')
    console.log(ANSII_RED, '---------------------------------------')
    return
  }
  const highestPrice = Math.max(...products.map((product) => product.saleValue))
  const stateSet = new Set<string>()

  products.forEach((product) => {
    if (product.saleValue === highestPrice) {
      const manufacturer = manufacturers.find(
        (manufacturer) => manufacturer.code === product.manufacturerId,
      )

      if (manufacturer) {
        const state = ufs.find(
          (uf) => uf.abbreviation === manufacturer.uf.abbreviation,
        )

        if (state) {
          stateSet.add(state.name)
        }
      }
    }
  })
  console.log('\n---------------------------------------')
  console.log('Estados com maior preco ', [...stateSet])
  console.log('---------------------------------------')
}

async function findManufacturersWithLowestValueProduct() {
  if (products.length === 0) {
    console.log(ANSII_RED, '\n---------------------------------------')
    console.log(ANSII_RED, '|     Lista de produtos Vazia  !      |')
    console.log(ANSII_RED, '---------------------------------------')
    return
  }
  const lowestPrice = Math.min(...products.map((product) => product.saleValue))
  const manufacturerSet = new Set<string>()

  products.forEach((product) => {
    if (product.saleValue === lowestPrice) {
      const manufacturer = manufacturers.find(
        (manufacturer) => manufacturer.code === product.manufacturerId,
      )

      if (manufacturer) {
        manufacturerSet.add(manufacturer.brand)
      }
    }
  })

  console.log([...manufacturerSet])
}

async function listProductsInAscendingOrderOfValue() {
  if (products.length === 0) {
    console.log(ANSII_RED, '\n---------------------------------------')
    console.log(ANSII_RED, '|     Lista de produtos Vazia  !      |')
    console.log(ANSII_RED, '---------------------------------------')
    return
  }
  const sortedProducts = products
    .slice()
    .sort((a, b) => a.saleValue - b.saleValue)

  console.log(sortedProducts)
}

async function listProductsInAscendingOrderOfProfit() {
  if (products.length === 0) {
    console.log(ANSII_RED, '\n---------------------------------------')
    console.log(ANSII_RED, '|     Lista de produtos Vazia  !      |')
    console.log(ANSII_RED, '---------------------------------------')
    return
  }
  const sortedProducts = products
    .slice()
    .sort(
      (a, b) => a.saleValue - a.purchaseValue - (b.saleValue - b.purchaseValue),
    )

  console.log(sortedProducts)
}

async function checkSeniorCustomers() {
  if (customers.length === 0) {
    console.log(ANSII_RED, '\n---------------------------------------')
    console.log(ANSII_RED, '|     Lista de clientes Vazia  !      |')
    console.log(ANSII_RED, '---------------------------------------')
    return
  }
  const seniorCustomersAbove60 = customers.filter(
    (customer) => customer.age > 60,
  )

  if (seniorCustomersAbove60.length >= 3) {
    seniorCustomersAbove60.forEach((customer) => {
      const index = customers.indexOf(customer)

      if (index !== -1) {
        customers.splice(index, 1)
        seniorCustomers.push(customer)
        console.log(
          ANSII_GREEN,
          '\n--------------------------------------------',
        )
        console.log(ANSII_GREEN, '|   Cliente Encontrado com sucesso ✅ !    |')
        console.log(
          ANSII_GREEN,
          '--------------------------------------------\n',
        )
        console.log(`| Nome            | ${customer.name}`)
        console.log('---------------------------------------')
        console.log(ANSII_RED, `| Id              | ${customer.id}`)
        console.log('---------------------------------------')
        console.log(`| Idade           | ${customer.age}`)
        console.log('---------------------------------------')
      }
    })

    console.log(
      ANSII_GREEN,
      '\n---------------------------------------------------------------------------------------------',
    )
    console.log(
      ANSII_GREEN,
      '|   Cliente removido da lista original e adicionado a lista de senior com sucesso ✅ !    |',
    )
    console.log(
      ANSII_GREEN,
      '---------------------------------------------------------------------------------------------',
    )
  } else {
    console.log(
      ANSII_RED,
      '\n---------------------------------------------------------------',
    )
    console.log(
      ANSII_RED,
      '|  Nao ha clientes acima de 60 anos o suficiente na lista  !  |',
    )
    console.log(
      ANSII_RED,
      '---------------------------------------------------------------',
    )
  }
}

async function checkProductValue() {
  const value = await validaNum(
    parseFloat(await printLine('Insira o valor do produto 💵  :')),
    'o valor',
  )

  let found = false
  let index = 0

  while (!found && index < products.length) {
    if (products[index].saleValue === value) {
      found = true
    }
    index++
  }

  if (found) {
    console.log(
      ANSII_GREEN,
      '\n----------------------------------------------------',
    )
    console.log(
      ANSII_GREEN,
      '|  Produto com esse valor encontrado na lista ✅!  |',
    )
    console.log(
      ANSII_GREEN,
      '----------------------------------------------------',
    )
    const product = products[index - 1]
    console.log(`\n| Nome            | ${product.name}`)
    console.log('---------------------------------------')
    console.log(`| Descricao       | ${product.description}`)
    console.log('---------------------------------------')
    console.log(ANSII_RED, `| FabricaId       | ${product.manufacturerId}`)
    console.log('---------------------------------------')
    console.log(`| Profit          | ${product.profit}`)
    console.log('---------------------------------------')
    console.log(`| Profit em %     | ${product.profitPercentage}`)
    console.log('---------------------------------------')
    console.log(`| Valor de Compra | ${product.purchaseValue}`)
    console.log('---------------------------------------')
    console.log(`| Valor de Venda  | ${product.saleValue}`)
    console.log('---------------------------------------')
    console.log(`| Peso       | ${product.weight}`)
    console.log('---------------------------------------')
  } else {
    console.log(
      ANSII_RED,
      '\n---------------------------------------------------',
    )
    console.log(
      ANSII_RED,
      '|   Nenhum produto encontrado com esse valor  !   |',
    )
    console.log(
      ANSII_RED,
      '---------------------------------------------------',
    )
  }
}

async function serveCustomersByQueue() {
  if (customers.length > 0) {
    const customer = customers.shift()
    console.log('\n---------------------------------------')
    console.log(`Servindo o cliente: ${customer?.name}`)
    console.log('---------------------------------------')
  } else {
    console.log(ANSII_RED, '\n---------------------------------------')
    console.log(ANSII_RED, '|     Lista de clientes Vazia  !      |')
    console.log(ANSII_RED, '---------------------------------------')
  }
}

async function serveCustomersByStack() {
  if (customers.length > 0) {
    const customer = customers.pop()
    console.log('\n---------------------------------------')
    console.log(`Servindo o cliente: ${customer?.name}`)
    console.log('---------------------------------------')
  } else {
    console.log(ANSII_RED, '\n---------------------------------------')
    console.log(ANSII_RED, '|     Lista de clientes Vazia  !      |')
    console.log(ANSII_RED, '---------------------------------------')
  }
}

async function displaySubMenu() {
  console.log(
    '\n||                                          SUB MENU 📋                                       ||',
  )
  console.log(
    '--------------------------------------------------------------------------------------------------',
  )
  console.log(
    '   [A]     | Listar produtos por fabricante                                                      |',
  )
  console.log(
    '--------------------------------------------------------------------------------------------------',
  )
  console.log(
    '   [B]     | Encontrar estado(s) onde há um produto com valor igual ao maior valor do sistema    |',
  )
  console.log(
    '--------------------------------------------------------------------------------------------------',
  )
  console.log(
    '   [C]     | Encontrar fabricante(s) onde há um produto com valor igual ao menor valor do sistema|',
  )
  console.log(
    '--------------------------------------------------------------------------------------------------',
  )
  console.log(
    '   [D]     | Listar todos os produtos em ordem crescente de valor                                |',
  )
  console.log(
    '--------------------------------------------------------------------------------------------------',
  )
  console.log(
    '   [E]     | Listar todos os produtos em ordem crescente de lucro                                |',
  )
  console.log(
    '--------------------------------------------------------------------------------------------------',
  )
  console.log(
    '   [F]     | Registrar um novo cliente na lista                                                  |',
  )
  console.log(
    '--------------------------------------------------------------------------------------------------',
  )
  console.log(
    '   [G]     | Listar todos clientes cadastrados                                                   |',
  )
  console.log(
    '--------------------------------------------------------------------------------------------------',
  )
  console.log(
    '   [H]     | Verificar se há algum cliente na lista com mais de 60 anos                          |',
  )
  console.log(
    '--------------------------------------------------------------------------------------------------',
  )
  console.log(
    '   [I]     | Verificar se há algum produto com o valor especificado pelo usuário                 |',
  )
  console.log(
    '--------------------------------------------------------------------------------------------------',
  )
  console.log(
    '   [J]     | Atender clientes com base em uma fila                                               |',
  )
  console.log(
    '--------------------------------------------------------------------------------------------------',
  )
  console.log(
    '   [K]     | Atender clientes com base em uma pilha                                              |',
  )
  console.log(
    '--------------------------------------------------------------------------------------------------',
  )
  console.log(
    '   [S]     | Retornar ao menu principal                                                          |',
  )
  console.log(
    '--------------------------------------------------------------------------------------------------',
  )
}
async function displayMenu(): Promise<void> {
  console.log('\n||               MAIN MENU                ||')
  console.log('--------------------------------------------')
  console.log('|  [1]     | Registrar um produto 🛒       |')
  console.log('--------------------------------------------')
  console.log('|  [2]     | Registrar uma fabrica🏛️        |')
  console.log('--------------------------------------------')
  console.log('|  [3]     | Registrar uma UF 🗺️            |')
  console.log('--------------------------------------------')
  console.log('|  [4]     | Listar Todos Produtos 🛒      |')
  console.log('--------------------------------------------')
  console.log('|  [5]     | Listar Todas as Fabricas🏛️     |')
  console.log('--------------------------------------------')
  console.log('|  [6]     | Listar Todas UFs 🗺️            |')
  console.log('--------------------------------------------')
  console.log('|  [7]     | Ir para SUBMENU               |')
  console.log('--------------------------------------------')
  console.log('|  [8]     | Sair do programa              |')
  console.log('--------------------------------------------')
}

async function subMenuCase() {
  let exitSubMenu = true

  while (exitSubMenu) {
    displaySubMenu()
    const option = await validaStr(
      await printLine('Insira sua Opcao: '),
      'a Opcao',
    )

    switch (option.toLowerCase().trim()) {
      case 'a':
        await listProductsByManufacturer()
        break
      case 'b':
        await findStatesWithHighestValueProduct()
        break
      case 'c':
        await findManufacturersWithLowestValueProduct()
        break
      case 'd':
        await listProductsInAscendingOrderOfValue()
        break
      case 'e':
        await listProductsInAscendingOrderOfProfit()
        break
      case 'f':
        await registerCustomer()
        break
      case 'g':
        console.log('|  Quais Clientes deseja listar   |')
        console.log('-----------------------------------')
        console.log('|  [01]     | ACIMA de 60 anos    |')
        console.log('-----------------------------------')
        console.log('|  [02]     | ABAIXO de 60 anos   |')
        console.log('-----------------------------------')
        console.log('|  [03]     | Retornar ao subMenu |')
        console.log('-----------------------------------')
        // eslint-disable-next-line no-case-declarations
        const choiceCustomer = await validaNum(
          await printLine('Insira sua Opcao: '),
          'a Opcao',
        )
        switch (choiceCustomer) {
          case 1:
            listCustomers()
            break
          case 2:
            listSeniorCustomers()
            break
          default:
            console.log('OPCAO INVALIDA')

            break
        }

        break
      case 'h':
        await checkSeniorCustomers()
        break
      case 'i':
        await checkProductValue()
        break
      case 'j':
        await serveCustomersByQueue()
        break
      case 'k':
        await serveCustomersByStack()
        break
      case 's':
        console.log('\n--------------------------------------------')
        console.log('|     Retornando ao menu principal         |')
        console.log('--------------------------------------------')
        exitSubMenu = false
        break
      default:
        console.log('Invalid option. Please enter a valid option.')
        break
    }
  }
}
async function main(): Promise<void> {
  let exitMain = true
  while (exitMain) {
    displayMenu()
    const choice = await validaNum(
      await printLine('Insira sua Opcao: '),
      'a Opcao',
    )
    switch (String(choice)) {
      case '1':
        await registerProduct()
        break
      case '2':
        await registerManufacturer()
        break
      case '3':
        await registerUF()
        break
      case '4':
        listProducts()
        break
      case '5':
        listManufacturers()
        break
      case '6':
        listUfs()
        break
      case '7':
        await subMenuCase()
        break
      case '8':
        console.log(
          ANSII_GREEN,
          '\n-----------------------------------------------------------',
        )
        console.log(
          ANSII_GREEN,
          '|  Saindo.. Obrigado por utilizar um dos nossos programas  |',
        )
        console.log(
          ANSII_GREEN,
          '-----------------------------------------------------------',
        )
        exitMain = false
        process.exit(0)
        break
      default:
        console.log('Invalid choice. Please try again.')
        break
    }
  }
}
main()
