import React, { createContext, useState, useCallback } from "react";
import { NotesTab } from "./types";
import { api } from "./api";
import { guid } from "./utils";
import { getPreviousTab } from "./App.utils";

type TabsState = "initial" | "loading" | "finished" | "error";

interface TabContextInteface {
  tabs: NotesTab[];
  tabsState: TabsState;
  getTabs: () => Promise<void>;
  addTab: () => void;
  saveTab: (tab: NotesTab) => void;
  removeTab: (id: string) => void;
  moveTabLeft: (id: string) => void;
}

export const TabContext = createContext<TabContextInteface>({
  tabs: [],
  tabsState: "initial",
  getTabs: () => Promise.resolve(),
  addTab: () => {},
  saveTab: () => {},
  removeTab: () => {},
  moveTabLeft: () => {},
});

export const TabProvider = ({ children }: any) => {
  const [tabs, setTabs] = useState([] as NotesTab[]);
  const [tabsState, setTabsState] = useState<TabsState>("initial");

  const token = window.localStorage.getItem("token") || "";

  const withErrorHandler = async (func: () => Promise<any>): Promise<any> => {
    try {
      setTabsState("loading");
      await func();
    } catch {
      setTabsState("error");
    } finally {
      setTabsState("finished");
    }
  };

  const getTabs = useCallback(async () => {
    withErrorHandler(async () => {
      const dbTabs = await api.fetchTabs(token);
      dbTabs.sort((a, b) => a.index - b.index);
      setTabs(dbTabs);
    });
  }, [token]);

  const addTab = async () => {
    withErrorHandler(async () => {
      await api.saveTab(token, {
        id: guid(),
        title: "New tab",
        index: tabs.length + 1,
      });
      await getTabs();
    });
  };

  const saveTab = async (tab: NotesTab) => {
    withErrorHandler(async () => {
      await api.saveTab(token, tab);
      await getTabs();
    });
  };

  const removeTab = async (id: string) => {
    withErrorHandler(async () => {
      await api.removeTab(token, { id });
      await getTabs();
    });
  };

  const moveTabLeft = async (id: string) => {
    withErrorHandler(async () => {
      const tab = tabs.find((tab) => tab.id === id);
      if (!tab) return;

      const previousTab = getPreviousTab(tabs, tab);
      if (!previousTab) return;

      await api.switchTabOrder(token, tab.id, previousTab.id);
      await getTabs();
    });
  };

  return (
    <TabContext.Provider
      value={{
        tabs,
        tabsState,
        getTabs,
        addTab,
        saveTab,
        removeTab,
        moveTabLeft,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};
