<?php

namespace App\Packages\Utils\Models\Relations;

trait HasBelongsToOne
{
    /**
     * Create the relations
     */
    protected function belongsToOne(
        string $related,
        string $table,
        string $foreignPivotKey,
        string $relatedPivotKey,
        ?string $parentKey = null,
        ?string $relatedKey = null,
        ?string $relation = null
    ): BelongsToOne {
        $instance = $this->newRelatedInstance($related);

        $relation = $relation ?: $this->guessBelongsToManyRelation();

        $foreignPivotKey = $foreignPivotKey ?: $this->getForeignKey();
        $relatedPivotKey = $relatedPivotKey ?: $instance->getForeignKey();

        return new BelongsToOne(
            $instance->newQuery(),
            $this,
            $table,
            $foreignPivotKey,
            $relatedPivotKey,
            $parentKey ?: $this->getKeyName(),
            $relatedKey ?: $instance->getKeyName(),
            $relation
        );
    }
}
