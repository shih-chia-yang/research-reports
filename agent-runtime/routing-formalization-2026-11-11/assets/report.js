(() => {
  const tabs = Array.from(document.querySelectorAll('.ar-tabs [role="tab"]'));
  const panels = Array.from(document.querySelectorAll('.ar-content [role="tabpanel"]'));
  function select(id, focus = false, updateHash = true) {
    const selected = document.getElementById(`tab-${id}`);
    if (!selected || !tabs.includes(selected)) return;
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.id !== `panel-${id}`; });
    if (focus) selected.focus();
    if (updateHash) history.replaceState(null, '', `#panel-${id}`);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.id.slice(4)));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        select(tabs[next].id.slice(4), true);
      }
    });
  });
  document.querySelectorAll('[data-view]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      select(link.dataset.view, true);
      document.getElementById(`panel-${link.dataset.view}`).scrollIntoView({block:'start'});
    });
  });
  function fromHash() {
    if (location.hash.startsWith('#panel-')) select(location.hash.slice(7), false, false);
  }
  addEventListener('hashchange', fromHash);
  fromHash();
})();
