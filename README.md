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
**Habla todo** drops a list with issues from both github, gitlab and trello.
```
habla todo
```
To configure use: 
```
habla github 
habla gitlab
habla trello
```
And follow the given instructions.

### Flags
```
-a, --all              Remove limit from task-list
-n, --number [amount]  Amount of tasks shown (is overwritten by --all)
-c, --current          Only shows tasks from the current repository.
-w, --withoutdeadline  Only shows tasks without deadlines
-u, --unassigned       Only shows unassigned tasks
```

### Example
```
habla todo -n 50 -c -u 
```
Get 50 unassigned issues, from the reposititory you are currently standing in. 
