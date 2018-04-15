import brain from 'brain.js'
import trainingData from './trainingData'

let trainedNet

const toPercentage = n => (n*100).toFixed(2)

const setResponse = assumption => {
  let output
  if (assumption) {
    output = `Det er ${assumption.probability}% mer sannsynlig at ${assumption.tweeter} skrev denne tweeten.`
  }

  document.getElementById('response').innerHTML = output
}

const encode = arg => arg.split('').map(x => x.charCodeAt(0) / 255)

const processTrainingData = data =>
  data.map(d => ({ input: encode(d.input), output: d.output }))

const train = data => {
  const net = new brain.NeuralNetwork()
  net.train(processTrainingData(data))
  trainedNet = net.toFunction()
  console.log('Finished training')
}

const execute = () => {
  const input = document.getElementById('input').value
  const results = trainedNet(encode(input))
  const {trump, kardashian} = results
  const assumption = {
    tweeter: trump > kardashian ? 'Trump' : 'Kardashian',
    probability: (Math.abs(trump - kardashian) * 100).toFixed(2),
  }
  setResponse(assumption)
}

window.onload = () => {
  document
    .getElementById('execute')
    .addEventListener('click', execute, false)
}

train(trainingData)
