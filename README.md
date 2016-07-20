Based on the repository URL, this CLI tool makes it easy for you to access the Github / Gitlab project page, issues page and single issue page.

## Install

```
npm i -g habla
```

## Usage

To access your Github/Gitlab project front page, navigate to your project directory (or a subdirectory).

```
habla
```

To view the issues page:

```
habla i
```

If used while you are currently on an issue branch called `issue/23` or `issues/23`, the above command will instead lead to the page for issue no 23.

If you want to view a specific issue:

```
habla i 23
```