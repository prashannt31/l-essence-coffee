export const notifyAdminDataUpdate = () => {
  window.dispatchEvent(
    new Event("admin-data-updated")
  );
};