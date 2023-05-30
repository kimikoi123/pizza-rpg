import { ethers } from "ethers"

export const signMessage = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  try {
    signer.signMessage("Hello World").then((result) => {
      console.log(result)
    })
  } catch (error) {
    // handle error
    console.log(error)
  }
}

export const withGrid = (n) => {
  return n * 16
}

export const asGridCoord = (x, y) => {
  return `${x * 16},${y * 16}`
}

export const nextPosition = (initialX, initialY, direction) => {
  let x = initialX
  let y = initialY
  const size = 16
  if (direction === "left") {
    x -= size
  } else if (direction === "right") {
    x += size
  } else if (direction === "up") {
    y -= size
  } else if (direction === "down") {
    y += size
  }
  return { x, y }
}

export const emitEvent = (name, detail) => {
  const event = new CustomEvent(name, {
    detail,
  })
  document.dispatchEvent(event)
}

export const oppositeDirection = (direction) => {
  if (direction === "left") {
    return "right"
  }
  if (direction === "right") {
    return "left"
  }
  if (direction === "up") {
    return "down"
  }
  return "up"
}
