      - name: Install Deno
        env:
          DENO_VERSION: '2.1.4'
          DENO_SHA256: '<paste checksum here>'
        run: |
          curl -fsSL -o /tmp/deno.zip \
            "https://github.com/denoland/deno/releases/download/v${DENO_VERSION}/deno-x86_64-unknown-linux-gnu.zip"
          echo "${DENO_SHA256}  /tmp/deno.zip" | sha256sum -c -
          mkdir -p "$HOME/.deno/bin"
          unzip -q /tmp/deno.zip -d "$HOME/.deno/bin"
          echo "$HOME/.deno/bin" >> "$GITHUB_PATH"

      - name: Build
        run: deno run --allow-read --allow-write --allow-run --allow-env ci/build.ts