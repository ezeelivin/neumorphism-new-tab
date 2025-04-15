document.addEventListener("DOMContentLoaded", function () {

  BookmarksManager.loadBookmarks();

  // Initialize the shortcuts
  ShortcutsManager.init();

  AiToolsManager.init();

  SearchEngineManager.init();

  EditShortcutMenuManager.init();

  EditSidebarManager.init();

  ClockManager.init();

  TodoManager.init();

  GoogleAppsManager.init();

  ThemeManager.init();

  CustomHeadingManager.init();

});