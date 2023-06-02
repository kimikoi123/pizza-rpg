import { wait } from "../utils/helpers"

export const Actions = {
    damage1: {
      name: "Whomp!",
      description: "Pillowy punch of dough",
      success: [
        { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
        { type: "animation", animation: "spin"},
        { type: "stateChange", damage: 10}
      ]
    },
    saucyStatus: {
      name: "Tomato Squeeze",
      description: "Applies the Saucy status",
      targetType: "friendly",
      success: [
        { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
        { type: "stateChange", status: { type: "saucy", expiresIn: 3 } }
      ]
    },
    clumsyStatus: {
      name: "Olive Oil",
      description: "Slippery mess of deliciousness",
      success: [
        { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
        { type: "animation", animation: "glob", color: "#dafd2a" },
        { type: "stateChange", status: { type: "clumsy", expiresIn: 3 } },
        { type: "textMessage", text: "{TARGET} is slipping all around!"},
      ]
    },
    //Items
    item_recoverStatus: {
      name: "Heating Lamp",
      description: "Feeling fresh and warm",
      targetType: "friendly",
      success: [
        { type: "textMessage", text: "{CASTER} uses a {ACTION}!"},
        { type: "stateChange", status: null },
        { type: "textMessage", text: "Feeling fresh!", },
      ]
    },
    item_recoverHp: {
      name: "Parmesan",
      targetType: "friendly",
      success: [
        { type:"textMessage", text: "{CASTER} sprinkles on some {ACTION}!", },
        { type:"stateChange", recover: 10, },
        { type:"textMessage", text: "{CASTER} recovers HP!", },
      ]
    },
  }

export const BattleAnimations = {
  async spin(event, onComplete) {
    const element = event.caster.pizzaElement
    const animationClassName =
      event.caster.team === "player" ? "battle-spin-right" : "battle-spin-left"
    element.classList.add(animationClassName)

    //Remove class when animation is fully complete
    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove(animationClassName)
      },
      { once: true }
    )

    //Continue battle cycle right around when the pizzas collide
    await wait(100)
    onComplete()
  },
  async glob(event, onComplete) {
    const { caster } = event
    let div = document.createElement("div")
    div.classList.add("glob-orb")
    div.classList.add(
      caster.team === "player" ? "battle-glob-right" : "battle-glob-left"
    )

    div.innerHTML = `
          <svg viewBox="0 0 32 32" width="32" height="32">
            <circle cx="16" cy="16" r="16" fill="${event.color}" />
          </svg>
        `

    //Remove class when animation is fully complete
    div.addEventListener("animationend", () => {
      div.remove()
    })

    //Add to scene
    document.querySelector(".Battle").appendChild(div)

    await wait(820)
    onComplete()
  },
}

export const Enemies = {
    "erio": {
      name: "Erio",
      src: "/characters/people/erio.png",
      pizzas: {
        "a": {
          pizzaId: "s001",
          maxHp: 50,
          level: 1,
        },
        "b": {
          pizzaId: "s002",
          maxHp: 50,
          level: 1,
        },
      }
    },
    "beth": {
      name: "Beth",
      src: "/characters/people/npc1.png",
      pizzas: {
        "a": {
          hp: 1,
          pizzaId: "f001",
          maxHp: 50,
          level: 1,
        },
      }
    }
  }