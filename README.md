
# FinDox Senior Frontend Test

  

This Project was done as a test to a Senior Frontend Engineer Job @ FinDox

  

## Business Requirements 
1. ✅ Users can search for deals by typing into search box and whatever text they type should be used to filter the rows in the grid by determining if any of the string columns contain that text
2.  ✅ Users can sort columns and filter rows to specific items (i.e. checkboxes like data filters in excel)
3.  ✅ Users can drill down into a deal to see the list of documents underneath it
4. ❓ Users can filter the list of documents by the tag
	**there is no 'tag' in the datasets, so the user can filter by every field like in deals view**

  

## Functional Requirements
1.  ✅  Create a grid component that supports
	-  ✅ Column Sorting
	-  ✅ Filtering in the column header
	-  ✅ Multi-select
	- 🕘  Thousands of records and dozens of columns
		**The table might experience some lagging when used with Thousands of records.
		I've created the table component using a table element, and the virtualization of the rows got a bit hairy, so I decided to skip due to short time available**
		💡 Perhaps taking a look on how some libraries do it, or even changing the structure to grid might help
	-  ✅ Export
2. ✅ Use the grid component on both the deals and documents pages

✅ You must use the Composition API in VueJs 3 💚

ℹ️ Some minor changes like data parsing and design details were also skipped due to time taken.

## Notes
- JavaScript was used instead of Typescript to gain time for not having to adjust typings
- Only this description, two JSON files with different structure and some low resolution screenshots were provided.


## Project Setup

```sh

npm install

```

  

### Compile and Hot-Reload for Development

  

```sh

npm run  dev

```

  

### Compile and Minify for Production

  

```sh

npm run  build

```

  

### Lint with [ESLint](https://eslint.org/)

  

```sh

npm run  lint

```