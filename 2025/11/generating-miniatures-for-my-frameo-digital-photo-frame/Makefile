.PHONY: all generate-miniatures prune-to-first-batch

# detect number of processors (fallback to 1)
NPROC := $(shell nproc 2>/dev/null || echo 1)
RESOLUTION := 1280x800
SDCARD := /media/timor/06E5-AE3E/
SOURCE_DIR := original
# TARGET_DIR := miniatures-$(RESOLUTION)-$(shell date +%Y%m%d)
TARGET_DIR := optimal
IGNORE_FILE := .frameoignore

all: generate-miniatures

generate-miniatures:
	@mkdir -p $(TARGET_DIR)
	@find original/ -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.heic' \) -print0 | \
		xargs -0 -P$(NPROC) -I{} sh -c 'f="$$1"; rel=$${f#original/}; dir=$$(dirname "$$rel"); name=$$(basename "$$rel"); base=$${name%.*}; if [ "$$dir" = "." ]; then outdir="$(TARGET_DIR)"; else outdir="$(TARGET_DIR)/$$dir"; fi; mkdir -p "$$outdir"; out="$$outdir/$$base.webp"; convert -limit thread 1 "$$f" -auto-orient -resize $(RESOLUTION) "$$out"; command -v exiftool >/dev/null 2>&1 && exiftool -overwrite_original -TagsFromFile "$$f" "-all:all>all:all" "$$out" || true; touch -r "$$f" "$$out"' _ {}

sync-to-sdcard:
	@echo "Syncing $(TARGET_DIR)/ -> $(SDCARD) (preserve mtimes, compare by size, no ownership)"
	@rsync -rltW --size-only --del --progress $(TARGET_DIR)/ $(SDCARD)

prune-to-first-batch:
	@echo "Pruning $(TARGET_DIR)/ to match $(TARGET_DIR)-first-batch/ (files not present in first batch will be removed)"
	@find $(TARGET_DIR) -type f -print0 | \
		xargs -0 -I{} sh -c 'f="$$1"; rel=$${f#$(TARGET_DIR)/}; if [ ! -e "$(TARGET_DIR)-first-batch/$$rel" ]; then echo "rm $$f"; rm -f "$$f"; fi' _ {}
	@# remove any now-empty directories under $(TARGET_DIR) but keep top-level $(TARGET_DIR)
	@find $(TARGET_DIR) -mindepth 1 -type d -empty -print0 | xargs -0 -r rmdir || true

prune-ignored:
	@echo "Pruning $(TARGET_DIR)/ based on $(IGNORE_FILE)"
	@find $(TARGET_DIR) -type f -print0 | \
		xargs -0 -I{} bash -c '\
			f="$$1"; rel=$${f#$(TARGET_DIR)/}; \
			if [ -f "$(IGNORE_FILE)" ]; then \
				while IFS= read -r pat || [ -n "$$pat" ]; do \
					case "$$pat" in ""|\#*) continue;; esac; \
					if [[ "$$rel" == $$pat ]]; then \
						echo "rm $$f (matched $$pat)"; rm -f "$$f"; exit 0; \
					fi; \
				done < "$(IGNORE_FILE)"; \
			fi' _ {}

list-ignored:
	@find $(TARGET_DIR) -type f -print0 | \
		xargs -0 -I{} sh -c 'f="$$1"; rel=$${f#$(TARGET_DIR)/}; if [ ! -e "$(TARGET_DIR)-first-batch/$$rel" ]; then echo "$$f" >> $(IGNORE_FILE); fi' _ {}
