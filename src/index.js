import { getTokenizer } from "kuromojin";

module.exports = (context) => {
  const { Syntax, RuleError, report, getSource } = context;

  return {
    [Syntax.Paragraph](node) {
      const text = getSource(node);

      return getTokenizer().then((tokenizer) => {
        const tokens = tokenizer.tokenize(text);

        tokens.forEach((token, index) => {
          if (
            token.surface_form === "か" &&
            token.pos === "助詞" &&
            token.pos_detail_1 === "副助詞／並立助詞／終助詞"
          ) {
            const prevToken = tokens[index - 1];
            const nextToken = tokens[index + 1];

            if (prevToken && nextToken && prevToken.pos === nextToken.pos) {
              report(
                node,
                new RuleError(
                  "並列の意味の「か」が使用されています。「もしくは」を使用してください。",
                  {
                    index: token.word_position - 1,
                  }
                )
              );
            }
          }
        });
      });
    },
  };
};
