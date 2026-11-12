// If another site loads this page inside a frame (to trick people into clicking), hide it and open it on its own.
if (window.top !== window.self) { document.documentElement.style.display = "none"; try { window.top.location.replace(window.location.href); } catch (e) {} }
