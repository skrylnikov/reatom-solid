
# reatom-solid

[Solid](https://github.com/ryansolid/solid) bindings package for [Reatom](https://github.com/artalar/reatom) store.


## Install

```
npm i reatom-solid
```

or

```sh
yarn add reatom-solid
```

> `reatom-solid` depends on and works with `@reatom/core`.

## Hooks Api

### useAtom

Connects the atom to the store represented in context and returns the state of the atom from the store (or default atom state).

#### Basic (useAtom)

```ts
const atomValue = useAtom(atom)
```

#### Depended value by selector

```ts
const atomValue = useAtom(atom, atomState => atomState[props.id])
```

### useAction

Binds action with dispatch to the store provided in the context.

#### Basic (useAction)

```ts
const handleDoSome = useAction(doSome)
```

#### Prepare payload for dispatch

```ts
const handleDoSome = useAction(value => doSome({ id: props.id, value }))
```

#### Conditional dispatch

If action creator don't return an action dispatch not calling.

```ts
const handleDoSome = useAction(payload => {
  if (condition) return doSome(payload)
})
```

## Usage

### Step 1. Create store

```jsx
// App

import { createStore } from '@reatom/core'
import { context } from 'reatom-solid'
import { Form } from './components/Form'

import './App.css'

export const App = () => {
  // create statefull context for atoms execution
  const store = createStore()

  return (
    <div className="App">
      <context.Provider value={store}>
        <Form />
      </context.Provider>
    </div>
  )
}
```

### Step 2. Use in component

```jsx
// components/Form

import { declareAction, declareAtom } from '@reatom/core'
import { useAction, useAtom } from 'reatom-solid'

const changeName = declareAction()
const nameAtom = declareAtom('', on => [
  on(changeName, (state, payload) => payload),
])

export const Form = () => {
  const name = useAtom(nameAtom)
  const handleChangeName = useAction(e => changeName(e.target.value))

  return (
    <form>
      <label htmlFor="name">Enter your name</label>
      <input id="name" value={name.value} onChange={handleChangeName} />
    </form>
  )
}
```
