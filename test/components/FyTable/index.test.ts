import { shallowMount, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import FyTable from "@/components/FyTable";

test("mount component", () => {
  const wrapper = mount(FyTable, {
    props: {},
  });

  expect(wrapper.html()).toMatchSnapshot();
});
