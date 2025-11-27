# Curiosity Report: How VS Code Detects Syntax Errors So Quickly

## 1. Introduction

VS Code feels incredibly fast at detecting syntax errors, even in very large TypeScript projects. Whenever something is wrong, it highlights issues almost instantly. I became curious about how it manages to do this so efficiently without freezing or slowing down, especially when dealing with hundreds of files.

To explore this, I generated several artificial TypeScript projects—each designed to stress a different part of VS Code’s language server. These experiments helped me understand how VS Code prioritizes what to analyze, how it detects errors, and why some files only show problems after being opened.

### Why it matters

Fast, accurate error detection directly impacts developer productivity.  
Understanding how VS Code works internally helps developers:

- Know why some errors appear immediately while others don't  
- Recognize how large projects are handled under the hood  
- Avoid assumptions about “full project” checking  
- Improve performance by avoiding unnecessary project-wide computation  

It also deepens appreciation for tools like the TypeScript Language Server and how they enable quick, incremental feedback.

---

## 2. How does it work?

### Concepts and Behaviors

VS Code uses the **Language Server Protocol (LSP)** rather than analyzing files itself.

Key behaviors:

- Only the **open file** is fully parsed and type-checked instantly.
- Files **related to the open file** are partially analyzed.
- Files **unrelated** remain “cold” until opened.

VS Code uses:

- **Incremental parsing**  
- **Cached ASTs**  
- **File watchers**  
- **Lazy semantic analysis**

This makes it extremely fast while still showing accurate diagnostics.

---

## 3. Experiments

### 3.2.1 Big File

I generated a very large TypeScript file containing thousands of exported constants.

When I purposely introduced syntax errors, VS Code flagged them in under a second—even though the file was massive.

This experiment demonstrated:

- Incremental parsing re-parses **only the affected regions**, not the entire file.

---

### 3.2.2 Big Project

Next, I created a huge folder tree with hundreds of files and cross-imports.

When I broke something inside a deep file:

- VS Code only showed errors **in the file I opened**.
- Other broken importers remained clean until opened.

This showed that VS Code **does not analyze the entire project immediately**.

---

### 3.2.3 Bulk Project (Fan-Out Imports)

I built a file `all.ts` exporting 30 values, and 30 separate importer files where each imported exactly one of those values.

After deleting the exports:

- Only the first few importer files updated automatically.
- The rest updated **only when manually opened**.

This clearly shows VS Code’s **partial diagnostics** behavior.

---

## 4. Analysis

Across all experiments, VS Code consistently prioritized:

1. **Fast, full syntax checking** in the open file  
2. **Selective, on-demand semantic work** for related files  
3. **Lazy evaluation** for everything else  

This keeps editing responsive:

- Big files remain editable without lag  
- Large projects don’t spike CPU  
- Diagnostics scale as you open files  

It also explains why some errors appear late—VS Code **intentionally avoids** checking everything upfront.

---

## 5. Connection to My Work

As someone working with TypeScript, Node, and AWS Lambda:

Understanding VS Code’s diagnostic behavior helps me:

- Structure large projects more efficiently  
- Realize that not all errors appear immediately  
- Rely on CI for deeper, full-project checks  
- Appreciate how incremental feedback loops make development faster  

---

## 6. Takeaway

VS Code isn’t scanning your entire project—it’s scanning what you need, when you need it.

Through:

- **Language servers**
- **Incremental parsing**
- **Lazy evaluation**

…it delivers extremely fast, accurate diagnostics without freezing.

Just like mutation testing exposes gaps in your tests, these experiments exposed how my editor “thinks” and how deeply optimized it really is.

---
## 7. How to Replicate My Experiments

### Big File

\`\`\`bash
for ((i=0;i<5000;i++)); do echo "export const x$i = $i;" >> big.ts; done
\`\`\`

### Big Project

\`\`\`bash
./generateTree.sh
\`\`\`

### Bulk Project (Fan-Out)

\`\`\`bash
./generateFanOut.sh
\`\`\`

### Steps

1. Open the generated folder in VS Code  
2. Add syntax errors to various files  
3. Observe when diagnostics appear depending on whether the file is open  
