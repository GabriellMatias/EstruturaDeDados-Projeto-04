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
      '--------------------------------------------------------------------',
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
      '----------------------------------------------------------------------------------------------',
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
      '---------------------------------------------------------',
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
  console.log(ANSII_GREEN, '---------------------------------------')
  console.log(ANSII_GREEN, '| Produto registrado com sucesso ✅ ! |')
  console.log(ANSII_GREEN, '---------------------------------------')
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
      '| Voce deve cadastrar uma UF antes de prosseguir 🗺️! |',
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

async function registerUF(): Promise<void> {
  const uf: UF = {} as UF
  uf.abbreviation = await validaStr(
    await printLine('Insira a abreviacao da UF :'),
    'a UF',
  )
  uf.name = await validaStr(
    await printLine('Insira a abreviacao da UF :'),
    'o nome da UF',
  )
  ufs.push(uf)
  console.log(ANSII_GREEN, '---------------------------------------')
  console.log(ANSII_GREEN, '|   UF registrada com sucesso ✅ !    |')
  console.log(ANSII_GREEN, '---------------------------------------')
}

async function registerCustomer(): Promise<void> {
  if (customers.length >= 30) {
    console.log(
      ANSII_RED,
      '------------------------------------------------------',
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
  console.log(ANSII_GREEN, '--------------------------------------------')
  console.log(ANSII_GREEN, '|   Cliente registrado com sucesso ✅ !    |')
  console.log(ANSII_GREEN, '--------------------------------------------')
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

  console.log(ANSII_GREEN, '--------------------------------------------')
  console.log(`${sortedProducts}`)
  console.log(ANSII_GREEN, '--------------------------------------------')
}

async function findStatesWithHighestValueProduct() {
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

  console.log([...stateSet])
}

async function findManufacturersWithLowestValueProduct() {
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
  const sortedProducts = products
    .slice()
    .sort((a, b) => a.saleValue - b.saleValue)

  console.log(sortedProducts)
}

async function listProductsInAscendingOrderOfProfit() {
  const sortedProducts = products
    .slice()
    .sort(
      (a, b) => a.saleValue - a.purchaseValue - (b.saleValue - b.purchaseValue),
    )

  console.log(sortedProducts)
}

async function checkSeniorCustomers() {
  const seniorCustomersAbove60 = customers.filter(
    (customer) => customer.age > 60,
  )

  if (seniorCustomersAbove60.length > 3) {
    seniorCustomersAbove60.forEach((customer) => {
      const index = customers.indexOf(customer)

      if (index !== -1) {
        customers.splice(index, 1)
        seniorCustomers.push(customer)
      }
    })

    console.log(
      'Customers removed from the original list and added to the senior customers list.',
    )
  } else {
    console.log(
      'There are not enough customers above 60 years old in the list.',
    )
  }
}

async function checkProductValue() {
  const value = parseFloat(await printLine('Enter the product value: '))

  let found = false
  let index = 0

  while (!found && index < products.length) {
    if (products[index].saleValue === value) {
      found = true
    }

    index++
  }

  if (found) {
    console.log('Product with the specified value exists in the list.')
  } else {
    console.log('No product with the specified value found in the list.')
  }
}

async function serveCustomersByQueue() {
  if (customers.length > 0) {
    const customer = customers.shift()
    console.log(`Serving customer: ${customer?.name}`)
  } else {
    console.log('No customers in the list.')
  }
}

async function serveCustomersByStack() {
  if (customers.length > 0) {
    const customer = customers.pop()
    console.log(`Serving customer: ${customer?.name}`)
  } else {
    console.log('No customers in the list.')
  }
}

async function displaySubMenu() {
  console.log('--- MENU ---')
  console.log('[a] Listar produtos por fabricante')
  console.log(
    '[b] Encontrar estado(s) onde há um produto com valor igual ao maior valor do sistema',
  )
  console.log(
    '[c] Encontrar fabricante(s) onde há um produto com valor igual ao menor valor do sistema',
  )
  console.log('[d] Listar todos os produtos em ordem crescente de valor')
  console.log('[e] Listar todos os produtos em ordem crescente de lucro')
  console.log('[f] Registrar um novo cliente na lista')
  console.log('[g] Verificar se há algum cliente na lista com mais de 60 anos')
  console.log(
    '[h] Verificar se há algum produto com o valor especificado pelo usuário',
  )
  console.log('[i] Atender clientes com base em uma fila')
  console.log('[j] Atender clientes com base em uma pilha')
  console.log('[s] Sair')
}
async function displayMenu(): Promise<void> {
  console.log('--- MENU ---')
  console.log('[1] Register a product')
  console.log('[2] Register a manufacturer')
  console.log('[3] Register a UF')
  console.log('[4] Ir para o Sub Menu')
  console.log('[5] Quit')
}

async function subMenuCase() {
  let exitSubMenu = true

  while (exitSubMenu) {
    displaySubMenu()
    const option = await printLine('Enter the desired option: ')

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
        await checkSeniorCustomers()
        break
      case 'h':
        await checkProductValue()
        break
      case 'i':
        await serveCustomersByQueue()
        break
      case 'j':
        await serveCustomersByStack()
        break
      case 's':
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
    const choice = await printLine('Enter your choice:')
    switch (choice) {
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
        await subMenuCase()
        break
      case '5':
        console.log('Quitting...')
        exitMain = false
        process.exit(0)
        break
      default:
        console.log('Invalid choice. Please try again.')
        break
    }
    console.log('-------------------------')
  }
}
main()
