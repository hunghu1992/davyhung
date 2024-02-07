// App.js
App({
  globalData: {
    currentTab: ''
  },
  tabBarRef: null,
  registerTabBarComponent(ref) {
    this.tabBarRef = ref;
  },
  setCurrentTab(index) {
    this.globalData.currentTab = index;
    if (this.tabBarRef) {
      this.tabBarRef.updateSelectedIndex(index);
    }
  }
});