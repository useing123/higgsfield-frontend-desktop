import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

// This is a simplified schema for demonstration.
// In a real implementation, this would be more robust and likely derived from the API schema.
interface FieldSchema {
  name: string
  label: string
  type: "string" | "number" | "boolean" | "enum" | "textarea"
  options?: string[]
  placeholder?: string
}

interface FormControlFactoryProps {
  fieldSchema: FieldSchema
  value: any
  onChange: (value: any) => void
}

export function FormControlFactory({ fieldSchema, value, onChange }: FormControlFactoryProps) {
  const { name, label, type, options, placeholder } = fieldSchema

  switch (type) {
    case "string":
    case "number":
      return (
        <div key={name} className="space-y-2">
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={name}
            type={type === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => onChange(type === "number" ? parseInt(e.target.value) : e.target.value)}
            placeholder={placeholder}
            className="bg-zinc-900 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
      )
    case "textarea":
      return (
        <div key={name} className="space-y-2">
          <Label htmlFor={name}>{label}</Label>
          <Textarea
            id={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px] bg-zinc-900 border-white/10 text-white placeholder:text-white/30 text-sm resize-none"
          />
        </div>
      )
    case "boolean":
      return (
        <div key={name} className="flex items-center justify-between">
          <Label htmlFor={name}>{label}</Label>
          <Switch id={name} checked={value} onCheckedChange={onChange} />
        </div>
      )
    case "enum":
      return (
        <div key={name} className="space-y-2">
          <Label htmlFor={name}>{label}</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="bg-zinc-900 border-white/10 text-white">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10">
              {options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    default:
      return null
  }
}