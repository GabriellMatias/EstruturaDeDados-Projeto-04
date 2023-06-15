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
  phone: string
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

async function printLine(prompt: string | number): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt.toString(), (input) => {
      resolve(input.trim())
    })
  })
}

const products: Product[] = []
const manufacturers: Manufacturer[] = []
const ufs: UF[] = []
const customers: Customer[] = []
const seniorCustomers: Customer[] = []

async function registerProduct(): Promise<void> {
  if (manufacturers.length === 0) {
    console.log('Primeiro registre uma fabrica para poder registrar um produto')
    return
  } else if (manufacturers.length < 2) {
    console.log(
      'Voce necessita de no minimo 2 fabricantes cadastrados para poder registar um produto',
    )
    return
  }
  const product: Product = {} as Product
  product.description = await printLine('Enter the product description:')
  product.weight = parseFloat(await printLine('Enter the product weight:'))
  product.purchaseValue = parseFloat(
    await printLine('Enter the product purchase value:'),
  )
  product.saleValue = parseFloat(
    await printLine('Enter the product sale value:'),
  )

  product.profit = product.saleValue - product.purchaseValue
  product.profitPercentage = (product.profit / product.purchaseValue) * 100

  const manufacturerCode = parseInt(
    await printLine('Enter the manufacturer code for the product:'),
  )

  const manufacturer = manufacturers.find((m) => m.code === manufacturerCode)
  if (manufacturer) {
    product.manufacturerId = manufacturer.code
    products.push(product)
    console.log('Product registered successfully!')
  } else {
    console.log(
      'Manufacturer not found. Register the manufacturer before registering the product.',
    )
  }
}

async function registerManufacturer(): Promise<void> {
  if (ufs.length === 0) {
    console.log('Primeiro voce precisa cadastrar uma UF antes de prosseguir 😀')
    return
  }
  if (manufacturers.length >= 5) {
    console.log('Maximum number of manufacturers reached.')
    return
  }

  const manufacturer: Manufacturer = {} as Manufacturer
  manufacturer.code = parseInt(await printLine('Enter the manufacturer code:'))
  manufacturer.brand = await printLine('Enter the manufacturer brand:')
  manufacturer.website = await printLine('Enter the manufacturer website:')
  manufacturer.phone = await printLine('Enter the manufacturer phone number:')

  const ufAbbreviation = await printLine(
    'Enter the UF abbreviation for the manufacturer:',
  )
  const uf = ufs.find((u) => u.abbreviation === ufAbbreviation)
  if (uf) {
    manufacturer.uf = uf
    manufacturers.push(manufacturer)
    console.log('Manufacturer registered successfully!')
  } else {
    console.log(
      'UF not found. Register the UF before registering the manufacturer.',
    )
  }
}

async function registerUF(): Promise<void> {
  const uf: UF = {} as UF
  uf.abbreviation = await printLine('Enter the UF abbreviation:')
  uf.name = await printLine('Enter the UF name:')
  ufs.push(uf)
  console.log('UF registered successfully!')
}

async function registerCustomer(): Promise<void> {
  if (customers.length >= 30) {
    console.log('Maximum number of customers reached.')
    return
  }
  const id = await printLine('Enter the customer ID: ')
  const name = await printLine('Enter the customer name: ')
  const age = await printLine('Enter the customer age: ')

  const customer: Customer = {
    id: Number(id),
    name,
    age: Number(age),
  }
  customers.push(customer)
  console.log('Customer registered successfully!')
}

async function listProductsByManufacturer() {
  const manufacturerCode = await printLine('Enter the manufacturer code: ')

  const filteredProducts = products.filter(
    (product) => product.manufacturerId === Number(manufacturerCode),
  )

  const sortedProducts = filteredProducts.sort((a, b) =>
    a.name.localeCompare(b.name),
  )

  console.log(sortedProducts)
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
