# Naming convention

## General rules

Use `camelCase` for naming. Exceptions:

* react components: `PascalCase`
* constants: `UPPER_SNAKE_CASE`
* css classes: `kebab-case`

Event handler props should be named as `on<EventName>`. Example: `onClick`.

## CSS class naming

Since we use css-modules, common words can be used for class names.

For example, we have a component `UserInfo` containing root element with class `user-info` and nested element containing user name.
In this case class name `name` would be enough for this nested element. No need to add component name like `user-info-name`.

```
const UserInfo = ({ name }) => (
  <div className={cx('user-info')}>
    <div className={cx('name')}>{name}</div>
  </div>
);
```

It is preferred to have a class name for the root element the same as a component's name, but it is not required.

## Redux naming

Actions should have postfix `Action`: `updateUserInfoAction`.

Selectors should have postfix `Selector`: `activeProjectSelector`.

Exported reducer should have postfix `Reducer`: `projectInfoReducer`.
