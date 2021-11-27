# autoprojects-cli

autoprojects-cli is a template managment system to auto generate projects

## Install

First make sure you have installed the latest version of [node.js](https://nodejs.org) (You may need to restart your computer after this step).

To install global:

```
npm install autoprojects-cli -g
```

## Usage

If you want to start a new project:

```
autoprojects-cli init-project <projectName>
```

### Templates

To add template:

```
cd my-example-api/
autoprojects-cli template add
```

To list templates:

```
autoprojects-cli template list
```

To remove template:

```
autoprojects-cli template remove <templateName>
```
