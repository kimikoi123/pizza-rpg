const PizzaTypes = {
  normal: "normal",
  spicy: "spicy",
  veggie: "veggie",
  fungi: "fungi",
  chill: "chill",
}

export const Pizzas = {
  s001: {
    name: "Slice Samurai",
    type: PizzaTypes.spicy,
    src: "/characters/pizzas/s001.png",
    icon: "/icons/spicy.png",
    actions: [ "saucyStatus", "clumsyStatus", "damage1" ],
  },
  v001: {
    name: "Call Me Kale",
    type: PizzaTypes.veggie,
    src: "/characters/pizzas/v001.png",
    icon: "/icons/veggie.png",
    actions: [ "damage1" ],
  },
  f001: {
    name: "Portobello Express",
    type: PizzaTypes.fungi,
    src: "/characters/pizzas/f001.png",
    icon: "/icons/fungi.png",
    actions: [ "damage1" ],
  },
}
