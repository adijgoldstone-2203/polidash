import re

def strip_ts_stuff(text):
    text = re.sub(r"^import\s+.*?;\n?", "", text, flags=re.MULTILINE)
    text = re.sub(r"^export\s+default\s+.*?;?\n?", "", text, flags=re.MULTILINE)
    text = re.sub(r"^export\s+", "", text, flags=re.MULTILINE)
    text = text.replace("<Criterion[]>", "")
    text = text.replace("<VennEngineProps>", "")
    text = text.replace(": React.FC", "")
    return text

with open("src/data.ts") as f:
    data_ts = strip_ts_stuff(f.read())

with open("src/VennEngine.tsx") as f:
    venn_tsx = strip_ts_stuff(f.read())

with open("src/Issues.tsx") as f:
    issues_tsx = strip_ts_stuff(f.read())

html = f"""<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <title>PoliDash Interactive Venn</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script id="tailwind-config">tailwind.config = {{darkMode: "class"}};</script>
    
    <script crossorigin="anonymous" src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin="anonymous" src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script crossorigin="anonymous" src="https://unpkg.com/framer-motion@11.1.7/dist/framer-motion.js"></script>
    <script crossorigin="anonymous" src="https://unpkg.com/@babel/standalone@7.23.0/babel.min.js"></script>
    <style>body {{ font-family: sans-serif; }}</style>
</head>
<body>
    <div id="root">
       <h1 style="color:red; text-align:center; margin-top:20%">Waiting for React...</h1>
    </div>
    <script>
      window.addEventListener("error", function(e) {{
          document.getElementById("root").innerHTML += "<h1 style='color:red'>" + (e.message || "Script error") + "</h1>";
      }});
    </script>
    <script type="text/babel" data-type="module" data-presets="typescript,react">
        try {{
            const {{ useState, useMemo }} = React;
            const motion = window.Motion ? window.Motion.motion : (window.framerMotion ? window.framerMotion.motion : null);
            
            {data_ts}
            {venn_tsx}
            {issues_tsx}

            const root = ReactDOM.createRoot(document.getElementById("root"));
            root.render(<Issues />);
            
            const waiting = document.querySelector('h1[style*="red"]');
            if (waiting) waiting.remove();
        }} catch(err) {{
            document.getElementById("root").innerHTML = "<div style='color:red; padding: 20px; font-size: 24px;'>React Runtime Error: " + err.message + "</div>";
            console.error(err);
        }}
    </script>
</body>
</html>
"""

with open("preview-issues-react.html", "w") as f:
    f.write(html)
print("Regenerated with type stripping")
