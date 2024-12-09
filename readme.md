Start with installing depenencies:

```
yarn
```

and

```
deno install
```

if you dont have deno installed, do as follows:

For linux:

### **1. Install Deno**

Deno provides an official installation script or package manager support.

#### Option 1: Install via the Official Script (Recommended)

Run the official installation script to install the latest version of Deno:

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

This will:

- Download and install Deno to your home directory at `~/.deno/bin/deno`.

#### Option 2: Install via Package Manager (Pacman)

Deno is available in the **community** repository on Manjaro:

1. Enable the community repository (if not already enabled).
2. Install Deno using Pacman:
   ```bash
   sudo pacman -Syu deno
   ```

#### Option 3: Install via `asdf` Version Manager

If you're using `asdf`:

1. Add the Deno plugin:
   ```bash
   asdf plugin-add deno
   ```
2. Install a specific version of Deno:
   ```bash
   asdf install deno latest
   ```
3. Set it globally or locally:
   ```bash
   asdf global deno latest
   ```

---

### **2. Add Deno to PATH (If Using the Script)**

If you installed Deno via the installation script, ensure the binary is in your `PATH`.

1. Edit your shell configuration file (`~/.zshrc` or `~/.bashrc`):
   ```bash
   nano ~/.zshrc
   ```
2. Add the following line:
   ```bash
   export PATH="$HOME/.deno/bin:$PATH"
   ```
3. Reload the shell configuration:
   ```bash
   source ~/.zshrc
   ```

---

### **3. Verify Installation**

Check if Deno is installed and working:

```bash
deno --version
```

You should see output like:

```
deno 1.x.x
v8 x.x.x
typescript x.x.x
```

---

### **4. Test Deno**

Run a simple script to verify functionality:

1. Create a `hello.ts` file:
   ```typescript
   console.log("Hello, Deno!");
   ```
2. Run the script:
   ```bash
   deno run hello.ts
   ```

---

### **5. Update Deno**

To update Deno to the latest version:

```bash
deno upgrade
```

---

### **6. (Optional) Enable VSCode Integration**

If you use VSCode, install the official Deno extension:

1. Open VSCode and go to the Extensions Marketplace (`Ctrl + Shift + X`).
2. Search for "Deno" and install the official Deno extension.
3. Configure the `settings.json` file:
   ```json
   {
     "deno.enable": true
   }
   ```
