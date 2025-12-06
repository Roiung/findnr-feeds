include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-simple2fa
PKG_VERSION:=1.0.0
PKG_RELEASE:=1
PKG_MAINTAINER:=findnr

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-simple2fa
	SECTION:=luci
	CATEGORY:=LuCI
	SUBMENU:=3. Applications
	TITLE:=Simple 2FA (TOTP) for Login
	# 修正依赖名：根据你的截图，改为 oath-toolkit 和 qrencode
	DEPENDS:=+oath-toolkit +qrencode +coreutils-base32
	PKGARCH:=all
endef

define Package/luci-app-simple2fa/description
	A minimal Two-Factor Authentication plugin intercepting ucode login.
endef

define Build/Compile
endef

# ==========================================================
# ⚠️ 注意：下面的每一行命令开头必须是 TAB 键，不能是空格！
# ==========================================================
define Package/luci-app-simple2fa/install
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(INSTALL_DIR) $(1)/www/cgi-bin
	$(INSTALL_DIR) $(1)/www/luci-static/resources/view/bootstrap/js

	# 复制文件
	$(CP) ./root/* $(1)/

	# 修正路径错误：原本写的是 cgi，这里必须是 cgi-bin
	$(INSTALL_BIN) ./root/www/cgi-bin/luci $(1)/www/cgi-bin/luci
endef

$(eval $(call BuildPackage,luci-app-simple2fa))
