import { IMessagesConfig } from './message.interface'

export const MessagesConfig = {
  message: {
    start: {
      message: {
        ru: '🎲 Aleo gambling — is a game bot where you can try your luck and have fun.\n\nTo cash out your funds, please use the command /cash_out followed by the amount you wish to withdraw. For example, type /cash_out 100 to withdraw 100 tokens.',
        en: '🎲 Bet Aleo — is a game bot where you can try your luck and have fun.\n\n/start - Initiates the bot and welcome message.\n/games - Displays a list of games.\n/set_bet - Sets the bet amount.\n/profile - Shows your profile.\n/cash_out - Withdraws funds.',
      },
    },
    selectLanguage: {
      message: {
        ru: 'Выберите язык',
        en: 'Select a language',
      },
    },
    changedLanguage: {
      message: {
        ru: 'Язык изменен на русский 🇷🇺',
        en: 'The language has been changed to english 🇺🇸',
      },
    },
    profile: {
      params: {
        wager: '0',
        betCount: '0',
        balance: '0',
        createDate: '',
      },
      message: {
        ru: '💣 Оборот — ${wager} 💎\n🎲 Сыграно ставок — ${betCount} \n💥 Баланс — ${balance} 💎\n🍄 Грибов — ${balanceMushrooms} 🍄\n💵 Монет — ${balanceCoins} 💰\n🎁 Промокод - ${referralCode}\n⌛ Дата регистрации — ${createDate}',
        en: '💣 Turnover — ${wager} 💎\n🎲 Bets placed — ${betCount} \n💥 Balance — ${balance} 💎\n⌛ Registration date — ${createDate}',
      },
    },
    gamesList: {
      message: {
        ru: 'Telegram игры: 🎲, ⚽, 🏀, 🎯, 🎳, 🎰',
        en: 'Telegram games: 🎲, ⚽, 🏀, 🎯, 🎳, 🎰',
      },
    },
    setBetInfo: {
      message: {
        ru: '<i>Укажите ставку: <code>/set_bet 0.2 $</code>, или <code>/set_bet 1 🍄</code>, или <code>/set_bet 1000 💰</code>, для сброса <code>/set_bet 0</code></i>',
        en: '<i>Specify your bet: <code>/set_bet 10</code></i>',
      },
    },
    cashOutInfo: {
      message: {
        ru: '<i>Specify your cash out: <code>/cash_out 10</code></i>',
        en: '<i>Specify your cash out: <code>/cash_out 10</code></i>',
      },
    },
    setBetReset: {
      message: {
        ru: '<i>Глобальная ставка сброшена</i>',
        en: '<i>Global bet has been reset</i>',
      },
    },
    setBetResult: {
      params: {
        amount: '',
        currencyIcon: '',
      },
      message: {
        ru: '<i>Глобальная ставка установлена <b>${amount}</b> ${currencyIcon}</i>',
        en: '<i>Global bet has been set to <b>${amount}</b> ${currencyIcon}</i>',
      },
    },
    maxBetWarning: {
      params: {
        amount: '',
        currencyIcon: '',
      },
      message: {
        ru: '<i>Минимальная ставка ${amount} ${currencyIcon}</i>',
        en: '<i>Minimum bet ${amount} ${currencyIcon}</i>',
      },
    },
    minBetWarning: {
      params: {
        amount: '',
        currencyIcon: '',
      },
      message: {
        ru: '<i>Максимальная ставка ${amount} ${currencyIcon}</i>',
        en: '<i>Maximum bet ${amount} ${currencyIcon}</i>',
      },
    },
    betBalanceWarning: {
      params: {
        amount: '',
        globalBet: '',
      },
      message: {
        ru: '<i>👉👈 Insufficient balance for the bet. Global bet ${globalBet}. Balance ${amount}\n\nPlace a smaller bet by /set_bet</i>',
        en: '<i>👉👈 Insufficient balance for the bet. Global bet ${globalBet}. Balance ${amount}\n\nPlace a smaller bet by /set_bet</i>',
      },
    },
    cashOutWarning: {
      params: {
        amount: '',
      },
      message: {
        ru: '<i>👉👈 It seems your balance is insufficient for the requested withdrawal amount. Your balance ${amount} 💎.</i>',
        en: '<i>👉👈 It seems your balance is insufficient for the requested withdrawal amount. Your balance ${amount} 💎.</i>',
      },
    },
    cashOut: {
      params: {
        amount: '',
        balance: '',
      },
      message: {
        ru: '<i>🎉 To proceed with the claim your ${amount} tokens, simply click the button below. This will redirect you to our website where you can complete the process. Remaining balance: ${balance} 💎\n\n(ONLY PC)</i>',
        en: '<i>🎉 To proceed with the claim your ${amount} tokens, simply click the button below. This will redirect you to our website where you can complete the process. Remaining balance: ${balance} 💎\n\n(ONLY PC).</i>',
      },
    },
  },
  gameMessage: {
    gameLose: {
      params: {
        gameEmoji: '🎲',
        amount: '',
        currencyIcon: '',
        username: 'No name',
      },
      message: {
        ru: '<i>@${username} проигрывает свою ставку <b>${amount}</b> ${currencyIcon} в игре ${gameEmoji}</i>',
        en: '<i>@${username} loses their bet <b>${amount}</b> ${currencyIcon} in the game ${gameEmoji}</i>',
      },
    },
    gameWin: {
      params: {
        gameEmoji: '🎲',
        amount: '',
        currencyIcon: '',
        username: 'No name',
      },
      message: {
        ru: '<b>@${username} побеждает в игре ${gameEmoji} на ${currencyIcon} ${amount}</b>',
        en: '<b>@${username} wins in the game ${gameEmoji} on ${currencyIcon} ${amount}</b>',
      },
    },
    gameBalanceLose: {
      params: {
        balance: '',
        currencyIcon: '',
      },
      message: {
        ru: '<i>На балансе осталось <b>${balance}</b> ${currencyIcon}</i>',
        en: '<i>Remaining balance: <b>${balance}</b> ${currencyIcon}</i>',
      },
    },
    gameBalanceWin: {
      params: {
        amount: '',
        balance: '',
        currencyIcon: '',
        multiplier: '0',
      },
      message: {
        ru: '<i>И получает <b>${amount}</b> ${currencyIcon} на свой баланс, теперь он <b>${balance} </b> ${currencyIcon}</i>\n<i>Мультипликатор: <b>${multiplier}x</b></i>',
        en: '<i>And receives <b>${amount}</b> ${currencyIcon} to their balance, now it`s <b>${balance} </b> ${currencyIcon}</i>\n<i>Multiplier: <b>${multiplier}x</b></i>',
      },
    },
    telegramGameDiceLose: {
      params: {
        gameEmoji: '🎲',
        luckyNumber: '0',
      },
      message: {
        ru: '<i>На ${gameEmoji} выпало ${luckyNumber}, для победы надо 4, 5, 6 :(</i>',
        en: '<i>${gameEmoji} rolled ${luckyNumber}, you need 4, 5, 6 to win :(</i>',
      },
    },
    telegramGameDiceWin: {
      params: {
        gameEmoji: '🎲',
        luckyNumber: '0',
      },
      message: {
        ru: '<i>На ${gameEmoji} выпало ${luckyNumber}, это больше 3!</i>',
        en: '<i>${gameEmoji} rolled ${luckyNumber}, it`s greater than 3!</i>',
      },
    },
    telegramGameFootballLose: {
      message: {
        ru: '<i>Мяч не попал в ворота :(</i>',
        en: '<i>The ball didn`t go into the goal :(</i>',
      },
    },
    telegramGameFootballWin: {
      message: {
        ru: '<i>Мяч попал в ворота, гол!</i>',
        en: '<i>The ball went into the goal, goal!</i>',
      },
    },
    telegramGameBasketballLose: {
      message: {
        ru: '<i>Мяч не попал в корзину :(</i>',
        en: '<i>The ball didn`t go into the basket :(</i>',
      },
    },
    telegramGameBasketballWinNearCenter: {
      message: {
        ru: '<i>Мяч попал в корзину!</i>',
        en: '<i>The ball went into the basket!</i>',
      },
    },
    telegramGameBasketballWinCleanShot: {
      message: {
        ru: '<i>Мяч попал прямо в корзину!</i>',
        en: '<i>The ball went straight into the basket!</i>',
      },
    },
    telegramGameDartsLose: {
      message: {
        ru: '<i>Не попал в мишень :(</i>',
        en: '<i>Missed the target :(</i>',
      },
    },
    telegramGameDartsWinNearCenter: {
      message: {
        ru: '<i>Достаточно близко к центру!</i>',
        en: '<i>Close to the center!</i>',
      },
    },
    telegramGameDartsWinAlmostCenter: {
      message: {
        ru: '<i>Почти в самый центр!</i>',
        en: '<i>Almost in the bullseye!</i>',
      },
    },
    telegramGameDartsWinCenter: {
      message: {
        ru: '<i>Точно в самый центр!</i>',
        en: '<i>Bullseye!</i>',
      },
    },
    telegramGameBowlingLose: {
      message: {
        ru: '<i>Осталось слишком много кегель :(</i>',
        en: '<i>Too many pins left :(</i>',
      },
    },
    telegramGameBowlingWinOnePinLeft: {
      message: {
        ru: '<i>Осталась всего 1 кегля!</i>',
        en: '<i>Only 1 pin left!</i>',
      },
    },
    telegramGameBowlingWinStrike: {
      message: {
        ru: '<i>Отличный бросок, был выбит страйк!</i>',
        en: '<i>Great throw, it`s a strike!</i>',
      },
    },
    telegramGameSlotsLose: {
      message: {
        ru: '<i>Неудачная комбинация :(</i>',
        en: '<i>Unlucky combination :(</i>',
      },
    },
    telegramGameSlotsWinGoodCombo: {
      message: {
        ru: '<i>Выпала неплохая комбинация!</i>',
        en: '<i>Got a decent combination!</i>',
      },
    },
    telegramGameSlotsWinGreatCombo: {
      message: {
        ru: '<i>Выпала отличная комбинация!</i>',
        en: '<i>Got an excellent combination!</i>',
      },
    },
  },
  button: {
    openWebApp: {
      message: {
        ru: '👛 Кошелёк',
        en: '👛 Wallet',
      },
    },
    sendProfile: {
      message: {
        ru: '💼 Профиль',
        en: '💼 Profile',
      },
    },
    sendTelegramGame: {
      message: {
        ru: '🎮 Играть',
        en: '🎮 Play',
      },
    },
    changeLanguage: {
      message: {
        ru: '🌐 Язык',
        en: '🌐 Language',
      },
    },
    openTelegramGame: {
      message: {
        ru: '🎮 Играть',
        en: '🎮 Play',
      },
    },
  },
}

//Если вы видите тут ошибку то const MessagesConfig не соответсвует интерфейсу IMessagesConfig
export const ValidMessagesConfig: IMessagesConfig = MessagesConfig
