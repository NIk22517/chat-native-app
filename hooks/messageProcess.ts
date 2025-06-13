export class MessageProcess<T, K extends string> {
  private readonly data: T[];
  private readonly getMessageType: (message: T) => K | null;
  private readonly groupTemplate: Record<K, T[]>;
  private readonly dateKey: keyof T;

  constructor({
    data,
    groupTemplate,
    getMessageType,
    dateKey,
  }: {
    data: T[];
    groupTemplate: Record<K, T[]>;
    getMessageType: (message: T) => K | null;
    dateKey: keyof T;
  }) {
    this.data = data;
    this.getMessageType = getMessageType;
    this.groupTemplate = groupTemplate;
    this.dateKey = dateKey;
  }

  public groupMessages(): Array<{ date: string } & Record<K, T[]>> {
    const groupedData = this.data.reduce((acc, message) => {
      const newDate = new Date(message[this.dateKey] as string);
      if (!newDate) return acc;

      const formattedDate = newDate.toISOString().split("T")[0];

      if (!acc[formattedDate]) {
        acc[formattedDate] = {
          date: formattedDate,
          ...this.createEmptyGroups(),
        };
      }

      const messageType = this.getMessageType(message);
      if (messageType) {
        acc[formattedDate][messageType].push(message);
      }

      return acc;
    }, {} as Record<string, { date: string } & Record<K, T[]>>);

    return Object.values(groupedData);
  }

  public flatData(): Array<{ date: string } | Record<K, T>> {
    return this.groupMessages().flatMap(({ date, ...groups }) => {
      const groupDate = new Date(date);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let displayDate: string;

      if (groupDate.toDateString() === today.toDateString()) {
        displayDate = "Today";
      } else if (groupDate.toDateString() === yesterday.toDateString()) {
        displayDate = "Yesterday";
      } else {
        displayDate = groupDate.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
      }

      const messages: Record<K, T>[] = [];

      Object.entries(groups).forEach(([key, items]) => {
        (items as T[]).forEach((item) => {
          messages.push({ [key as K]: item } as Record<K, T>);
        });
      });

      return [...messages, { date: displayDate }];
    });
  }

  private createEmptyGroups(): Record<K, T[]> {
    return Object.fromEntries(
      Object.keys(this.groupTemplate).map((key) => [key, [] as T[]])
    ) as Record<K, T[]>;
  }
}
