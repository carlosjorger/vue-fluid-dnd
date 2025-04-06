<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/vue/useDragAndDrop";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Copy } from 'lucide-vue-next'
const numbers = ref([
  1,
  2,
  3,
]);

const { id } = defineProps<{
  id: string;
}>();
const { parent } = useDragAndDrop<number>(numbers as any);
</script>
<template>
     <Dialog :id="id">
    <DialogTrigger as-child>
      <Button variant="outline">
        Share
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-md">
        <div>
            <ul ref="parent" class="vertical-list">
                <li
                    v-for="(element, index) in numbers"
                    :index="index"
                    :key="element"
                    class="z-100"
                    >
                        {{ element }}
                </li>
            </ul>
        </div>
    </DialogContent>
  </Dialog>
  
</template>
<style scoped>
.vertical-list {
  display: block;
  padding-inline: 10px;
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
}
</style>
