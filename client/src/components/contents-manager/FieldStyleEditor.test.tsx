import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FieldStyleEditor } from "@/components/contents-manager/FieldStyleEditor";
import { NOTO_SERIF_JP_FONT_LABEL, NOTO_SERIF_JP_FONT_VALUE } from "@/types/home-copy-style";

describe("FieldStyleEditor", () => {
  it("テキストフォントの選択肢に Noto Serif JP が表示される", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<FieldStyleEditor onStyleChange={vi.fn()} />);

    expect(screen.getByText("テキストフォント")).toBeInTheDocument();

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    const listbox = await screen.findByRole("listbox");
    expect(within(listbox).getByText(NOTO_SERIF_JP_FONT_LABEL)).toBeInTheDocument();
  });

  it("Noto Serif JP 選択時に onStyleChange が呼ばれる", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onStyleChange = vi.fn();
    render(<FieldStyleEditor onStyleChange={onStyleChange} />);

    await user.click(screen.getByRole("combobox"));
    const listbox = await screen.findByRole("listbox");
    await user.click(within(listbox).getByText(NOTO_SERIF_JP_FONT_LABEL));

    expect(onStyleChange).toHaveBeenCalledWith({
      fontFamily: NOTO_SERIF_JP_FONT_VALUE,
    });
  });
});
