
# reatom-solid

[Solid](https://github.com/ryansolid/solid) bindings package for [Reatom](https://github.com/artalar/reatom) store.

# 🚫 Deprecated❗️❗️❗️
Please use [official adapter](https://www.reatom.dev/adapter/npm-solid-js/)

## Install

```
npm i reatom-solid
```

or

```sh
yarn add reatom-solid
```

> `reatom-solid` depends on and works with `@reatom/core` and `solid-js`.

## Hooks Api

### useAtom

Connects the atom to the store represented in context and returns the state of the atom from the store (or default atom state).

#### Basic (useAtom)

```ts
const [atomValue] = useAtom(atom)
```

#### Depended value by selector

```ts
const atomValue = useAtom(atom, atomState => atomState[props.id])
const atomValue = createMemo(() => {
    const atom = createAtom({ dataAtom }, ({ get }) => get("dataAtom")[props.id]);
    const [value] = useAtom(atom);
    return value;
});
```

### useAction

Binds action with dispatch to the store provided in the context.

#### Basic (useAction)

```ts
const handleUpdateData = useAction(dataAtom.update)
```

#### Prepare payload for dispatch

```ts
const handleUpdateData = useAction((value) => dataAtom.update({ id: props.id, value }))
```

#### Conditional dispatch

If action creator don't return an action dispatch not calling.

```ts
const handleUpdateData = useAction((payload) => {
  if (condition) return dataAtom.update(payload)
})
```

## Usage

### Step 0 - OPTIONAL. Create store

```jsx
// App

import { createStore } from '@reatom/core'
import { reatomContext } from 'reatom-solid'
import { Form } from './components/Form'

import './App.css'

export const App = () => {
  // create statefull context for atoms execution
  const store = createStore()

  return (
    <div className="App">
      <reatomContext.Provider value={store}>
        <Form />
      </reatomContext.Provider>
    </div>
  )
}
```

### Step 1. Bind your atoms.

```jsx
// components/Form

import { createPrimitiveAtom } from '@reatom/core/primitives'
import { useAtom } from 'reatom-solid'

const nameAtom = createPrimitiveAtom('', {
  onChange: (e) => e.currentTarget.value,
})

export const Form = () => {
  const [name, { onChange }] = useAtom(nameAtom)

  return (
    <form>
      <label htmlFor="name">Enter your name</label>
      <input id="name" value={name} onChange={onChange} />
    </form>
  )
}
```


### Demo

[Codesandbox](https://codesandbox.io/s/reatom-solid-example-9u7pj?file=/index.js)
