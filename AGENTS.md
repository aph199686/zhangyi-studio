# 仓库协作约定

- `docs/产品说明书.md` 是第一次使用者说明的事实源。每次改变工作台或张翼 skill 的用户可见功能、流程、页签、推荐逻辑、导出内容或限制，同一批提交更新说明书的版本、步骤和能力边界。
- 运行 `node tools/build_studio.mjs` 生成 `nest/studio.bundle.js` 和 `nest/guide.html`；提交生成物。检查工作台“使用说明”入口与页面按钮、项目包文件名一致。
- 修改 skill 时运行 `python -X utf8 tools/validate.py` 通过后再提交。
- **路由器不许说谎**：新增、改名或删除任何 `skills/zhangyi-*` 时，同一批同步 `skills/zhangyi/SKILL.md` 的阶段路由表（含主流程）、`references/阶段识别表.md`（含阶段计数）与 `references/授翼仪式.md`；`tests/zhangyi-router.test.mjs` 会拦住漏同步。
- 不删除文件或目录，除非先列清单并获得确认。卡片和评审中的来源引用保持脱敏。
- 验收用的具体项目记录、导出 ZIP、截图和测试报告保存在仓库外的本地目录；不得提交或推送。提交前逐项检查待提交文件清单。
