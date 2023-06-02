const PizzaTypes = {
  normal: "normal",
  spicy: "spicy",
  veggie: "veggie",
  fungi: "fungi",
  chill: "chill",
}

export const Pizzas = {
  "s001": {
    name: "Slice Samurai",
    description: "Pizza desc here",
    type: PizzaTypes.spicy,
    src: "/characters/pizzas/s001.png",
    icon: "/icons/spicy.png",
    actions: [ "saucyStatus", "clumsyStatus", "damage1" ],
  },
  "s002": {
    name: "Bacon Brigade",
    description: "A salty warrior who fears nothing",
    type: PizzaTypes.spicy,
    src: "/characters/pizzas/s002.png",
    icon: "/icons/spicy.png",
    actions: [ "damage1", "saucyStatus", "clumsyStatus" ],
  },
  "v001": {
    name: "Call Me Kale",
    description: "Pizza desc here",
    type: PizzaTypes.veggie,
    src: "/characters/pizzas/v001.png",
    icon: "/icons/veggie.png",
    actions: [ "damage1" ],
  },
  "f001": {
    name: "Portobello Express",
    description: "Pizza desc here",
    type: PizzaTypes.fungi,
    src: "/characters/pizzas/f001.png",
    icon: "/icons/fungi.png",
    actions: [ "damage1" ],
  }
}
