// modules externos
const inquirer = require('inquirer')
const chalk = require('chalk')

// modules internos
const fs = require('fs')

operation()

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que voce deseja fazer? ',
            choices: ['Criar Conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair'],
        },
    ])
    .then((answer) => {
        const action = answer['action']
        
        if(action === 'Criar Conta'){
            createAccount()
        }else if(action === 'Consultar Saldo'){

        }else if(action === 'Depositar'){
            deposit()
        }else if(action === 'Sacar'){

        }else if(action === 'Sair'){
            console.log(chalk.bgBlueBright.black('Obrigado por usar o Accounts!!!'))
            process.exit()
        }
    })
    .catch((err) => console.log(err))
}

function createAccount() {
    console.log(chalk.bgGreen.black('Obrigado por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opcoes da sua conta a seguir'))

    buildAccount()
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para sua conta: '
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']
        console.info(accountName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.red('Esta conta ja existe, tente outro nome...'))
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err) {
            console.log(err)
        })

        console.log(chalk.green('Conta criada com sucesso!'))

        operation()

    })
    .catch(err => console.log(err))
}

function deposit(accountName){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da conta que voce deseja depositar dinheiro? ',
        },
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        if(!accountExists(accountName)){
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto voce deseja depositar? ',
            },
        ])
        .then((answer) => {
            const amount = answer['amount']

            addAmount(accountName, amount)
            operation()
        })
    })
    .catch(err => console.log(err))
}

function accountExists(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta nao existe, tente outra: '))
        return false
    }
    return true
}

function addAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){ 
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde! '))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`O valor de R$${amount} foi depositado com successo!`))
}

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r',
    })

    return JSON.parse(accountJSON)
}