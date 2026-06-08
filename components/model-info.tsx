import type { EditorModel } from "@/lib/editor-models"

// Turns one EditorModel's data into the styled card body. Built once; every
// model in lib/editor-models.ts renders through this with identical styling.
export function ModelInfo({ model }: { model: EditorModel }) {
  return (
    <div className="space-y-4 text-sm leading-relaxed">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">{model.title}</h2>
        <p className="text-muted-foreground">{model.description}</p>
      </div>

      {model.sections.map((section, i) => (
        <section key={i} className="space-y-1.5">
          <h3 className="font-semibold text-foreground">{section.heading}</h3>

          {section.paragraphs?.map((p, j) => (
            <p key={j} className="text-muted-foreground">
              {p}
            </p>
          ))}

          {section.items && section.items.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              {section.items.map((item, j) => (
                <li key={j}>
                  <span className="font-medium text-foreground">{item.term} </span>
                  {item.text}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}
