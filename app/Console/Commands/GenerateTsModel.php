<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use ReflectionClass;
use ReflectionProperty;

class GenerateTsModel extends Command
{
    protected $signature = 'generate:ts-model {class} {--output=}';
    protected $description = 'Generate TypeScript class from a PHP model class';

    public function handle()
    {
        $className = $this->argument('class');
        $outputPath = $this->option('output') ?? base_path('resources/ts-models');

        if (!class_exists($className)) {
            $this->error("Class {$className} not found.");
            return 1;
        }

        $reflection = new ReflectionClass($className);
        $tsClassName = $reflection->getShortName();

        // Get constants
        $constants = $reflection->getConstants();

        // Get public properties
        $properties = $reflection->getProperties(ReflectionProperty::IS_PUBLIC);

        // Generate TS code
        $tsCode = "export class {$tsClassName} {\n";

        // Add constants as static readonly
        foreach ($constants as $name => $value) {
            $tsCode .= "  static readonly {$name} = " . var_export($value, true) . ";\n";
        }
        $tsCode .= "\n";

        // Add properties as class members
        foreach ($properties as $prop) {
            $propName = $prop->getName();
            $tsCode .= "  {$propName}: any;\n"; // you can improve typing here
        }

        // Constructor
        if (count($properties) > 0) {
            $tsCode .= "\n  constructor(init?: Partial<{$tsClassName}>) {\n";
            $tsCode .= "    Object.assign(this, init);\n";
            $tsCode .= "  }\n";
        }

        // Try to find allStatuses static method and generate a TS static method if present
        if ($reflection->hasMethod('allStatuses')) {
            // Attempt to call the method (only if no args and safe)
            try {
                $statuses = $className::allStatuses();
                $statusesArray = json_encode($statuses, JSON_PRETTY_PRINT);
                $tsCode .= "\n  static allStatuses(): string[] {\n";
                $tsCode .= "    return {$statusesArray};\n";
                $tsCode .= "  }\n";
            } catch (\Throwable $e) {
                // skip if cannot call
            }
        }

        $tsCode .= "}\n";

        // Ensure output directory exists
        if (!is_dir($outputPath)) {
            mkdir($outputPath, 0755, true);
        }

        // Save the file
        $filePath = "{$outputPath}/{$tsClassName}.ts";
        file_put_contents($filePath, $tsCode);

        $this->info("TypeScript model generated at: {$filePath}");

        return 0;
    }
}
