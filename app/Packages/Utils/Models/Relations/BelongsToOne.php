<?php

namespace App\Packages\Utils\Models\Relations;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class BelongsToOne extends BelongsToMany
{
    /** Return a single model instead of a Collection */
    public function getResults()
    {
        return $this->query->first();
    }

    /** When the parent is null (keep default behavior) */
    public function getEager()
    {
        return parent::getEager();
    }

    /** Prepare relation on an array of models */
    public function initRelation(array $models, $relation)
    {
        foreach ($models as $model) {
            $model->setRelation($relation, null);
        }
        return $models;
    }

    /** Match the eagerly loaded results to their parents (one related model per parent) */
    public function match(array $models, Collection $results, $relation)
    {
        $dictionary = [];

        // Use the parent key from the pivot (e.g., blog_id) as the dictionary key
        $parentKeyOnPivot = $this->foreignPivotKey; // e.g. 'blog_id'

        foreach ($results as $result) {
            // Expect pivot is loaded by BelongsToMany eager query
            $parentId = data_get($result, "pivot.{$parentKeyOnPivot}");

            if (is_scalar($parentId)) {
                // Keep only the first related model per parent
                if (!array_key_exists($parentId, $dictionary)) {
                    $dictionary[$parentId] = $result;
                }
            }
        }

        foreach ($models as $model) {
            $model->setRelation(
                $relation,
                $dictionary[$model->getKey()] ?? null
            );
        }

        return $models;
    }

    /** Not needed for one-to-one mapping; keep for completeness if referenced elsewhere */
    protected function buildDictionary(Collection $results)
    {
        $dictionary = [];

        $foreign = $this->foreignPivotKey; // e.g. 'blog_id'

        foreach ($results as $result) {
            $parentId = data_get($result, "pivot.{$foreign}");
            if (is_scalar($parentId) && !array_key_exists($parentId, $dictionary)) {
                $dictionary[$parentId] = $result;
            }
        }

        return $dictionary;
    }
}
