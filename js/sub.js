(() => {
  const shareBtn = document.querySelector("[data-share]");
  if (!shareBtn) return;

  shareBtn.addEventListener("click", async () => {
    const url = location.href;
    const title = document.title;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        alert("링크가 클립보드에 복사되었습니다.");
      }
    } catch {
      /* 사용자 취소 또는 공유 미지원 */
    }
  });
})();
